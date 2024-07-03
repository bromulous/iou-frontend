import React, { useState, useEffect, useContext } from "react";
import { Container, Stepper, Step, StepLabel, Button, Box, Grid, Typography, Card, CardContent, CardActions } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import backend from "../api";
import { UserContext } from "../contexts/UserContext";
import ProjectInfoStep from "./ProjectInfoStep";
import BondDetailsStep from "./BondDetailsStep";
import AuctionScheduleStep from "./AuctionScheduleStep";
import RepaymentDetailsStep from "./RepaymentDetailsStep";
import SummaryStep from "./SummaryStep";

const BondIssuanceFlow = () => {
    const navigate = useNavigate();
  const location = useLocation();
  const { bond } = location.state || {};
  const { currentUserId } = useContext(UserContext);
  const steps = ["Project Info", "Bond Details", "Auction Schedule", "Repayment Details", "Summary"];
  const [activeStep, setActiveStep] = useState(0);
  const [draftId, setDraftId] = useState(bond?.draft_id || null);
  const [projectInfo, setProjectInfo] = useState(bond?.project_info || {
    name: "",
    description: "",
    website: "",
    imageUrl: "",
    coinGeckoUrl: "",
  });
  const [bondDetails, setBondDetails] = useState(bond?.bond_details || {
    title: "",
    totalAmount: 0,
    infiniteTokens: false,
    tokens: 1,
    tokenPrice: 0,
    tokenSymbol: "",
    interestRate: 0,
    requiresFullSale: false,
    latePenalty: 0,
    earlyRepayment: false,
    collateral: false,
  });
  const [auctionSchedule, setAuctionSchedule] = useState(bond?.auction_schedule || {
    auctionType: "automatic",
    auctionDuration: {days: 3, hours: 0},
    auctionEndCondition: "full-sale",
    adjustAutomatically: false,
    adjustmentType: "percentage",
    adjustmentDetails: { intervalDays: 1, intervalHours: 0, amount: 0, rate: 0 },
    minPrice: 0,
    startAutomatically: false,
    startDate: new Date().toISOString(),
    timezone: "current"
  });
  const [bondRepayment, setBondRepayment] = useState(bond?.bond_repayment || {
    bondDuration: { years: 0, months: 0, days: 0 },
    repaymentType: "interest-only",
    paymentSchedule: "fixed",
    fixedPaymentInterval: { days: 0, months: 0, years: 0 },
    customRepaymentSchedule: [],
  });


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (index) => {
    setActiveStep(index);
  };

  const handleSaveDraft = async (show_alert=true) => {
    let res;
    if  ( bondDetails.tokens <= 0) {
        bondDetails.tokenPrice = 0
    } else {
        bondDetails.tokenPrice = bondDetails.totalAmount / bondDetails.tokens
    }

    let draft = {
      project_info: projectInfo,
      bond_details: bondDetails,
      auction_schedule: auctionSchedule,
      bond_repayment: bondRepayment,
    };
    if (draftId !== null) {
      draft.draft_id =draftId;
    }
    try {
      res = await backend.post(`/users/${currentUserId}/save_draft`, draft);
      setDraftId(res.data.draft_id);
      if (show_alert) {
        alert("Draft saved!");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    }
    return res;
  };

  const handleFinish = async () => {
    handleSaveDraft();
    navigate(`/profile/${currentUserId}`)
  }

  const handlePublishBond = async () => {
    let response;

    response = await handleSaveDraft(false);
    if ( response.status !== 200) {
      alert("Error saving draft");
      return;
    };
    const data = {
        user_id: currentUserId,
        draft_id: response.data.draft_id,
      };
    try {
      await backend.post(`/users/${currentUserId}/issue_bond`, data);
      alert("Bond published!");
      navigate(`/profile/${currentUserId}`);

    } catch (error) {
      console.error("Error publishing bond:", error);
      alert("Error publishing bond");
    }
  };

  const handleAddPaymentSchedule = () => {
    setBondRepayment({
      ...bondRepayment,
      customRepaymentSchedule: [
        ...bondRepayment.customRepaymentSchedule,
        { days: 0, months: 0, years: 0, interest: 0, principal: 0},
      ],
    });
  };

  const handleRemovePaymentSchedule = (index) => {
    setBondRepayment({
      ...bondRepayment,
      customRepaymentSchedule: bondRepayment.customRepaymentSchedule.filter((_, scheduleIndex) => scheduleIndex !== index),
    });
  };

  const handlePaymentScheduleChange = (index, field, value) => {
    const newSchedule = [...bondRepayment.customRepaymentSchedule];
    newSchedule[index][field] = value;
    setBondRepayment({
      ...bondRepayment,
      customRepaymentSchedule: newSchedule,
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <ProjectInfoStep projectInfo={projectInfo} setProjectInfo={setProjectInfo} />;
      case 1:
        return <BondDetailsStep bondDetails={bondDetails} setBondDetails={setBondDetails} />;
      case 2:
        return <AuctionScheduleStep bondDetails={bondDetails} auctionSchedule={auctionSchedule} setAuctionSchedule={setAuctionSchedule} bondRepayment={bondRepayment} />;
      case 3:
        return <RepaymentDetailsStep bondRepayment={bondRepayment} setBondRepayment={setBondRepayment} handleAddPaymentSchedule={handleAddPaymentSchedule} handleRemovePaymentSchedule={handleRemovePaymentSchedule} handlePaymentScheduleChange={handlePaymentScheduleChange} />;
      case 4:
        return <SummaryStep projectInfo={projectInfo} bondDetails={bondDetails} auctionSchedule={auctionSchedule} bondRepayment={bondRepayment} handlePublishBond={handlePublishBond} />;
      default:
        return "Unknown step";
    }
  };

  const handleCardClick = (bond) => {
    if (bond.bond_sold) {
      alert("View Bond Summary");
    } else {
      alert("Edit Bond");
    }
  };

  return (
    <Container>
      <Box sx={{ pt: 10 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} onClick={() => handleStepChange(index)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box sx={{ mt: 4}}>
        {renderStepContent(activeStep)}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, mb: 4}}>
          <Button
            variant="contained"
            color="primary"
            onClick={activeStep === steps.length - 1 ? handlePublishBond : handleSaveDraft}
          >
            {activeStep === steps.length - 1 ? "Publish Bond" : "Save Draft"}
          </Button>
          <Box>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button variant="contained" onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default BondIssuanceFlow;
