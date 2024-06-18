import React from "react";
import { Box, Grid, TextField, Button, Typography } from "@mui/material";

const ProjectInfoStep = ({ projectInfo, setProjectInfo, handleSaveDraft }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Project Info</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Project Name"
            fullWidth
            value={projectInfo.name}
            onChange={(e) =>
              setProjectInfo({ ...projectInfo, name: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={projectInfo.description}
            onChange={(e) =>
              setProjectInfo({
                ...projectInfo,
                description: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Website"
            fullWidth
            value={projectInfo.website}
            onChange={(e) =>
              setProjectInfo({ ...projectInfo, website: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Coin Gecko URL"
            fullWidth
            value={projectInfo.coinGeckoUrl}
            onChange={(e) =>
              setProjectInfo({
                ...projectInfo,
                coinGeckoUrl: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Image URL"
            fullWidth
            value={projectInfo.imageUrl}
            onChange={(e) =>
              setProjectInfo({ ...projectInfo, imageUrl: e.target.value })
            }
          />
          {projectInfo.imageUrl && (
            <Box sx={{ mt: 2 }}>
              <img
                src={projectInfo.imageUrl}
                alt="Project"
                style={{ maxWidth: "200px" }}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectInfoStep;
