// UpgradePlanDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Typography,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlanCard from '~/pages/UpgradePlan/PlanCard';
import PlanTypeTabs from '~/pages/UpgradePlan/PlanTypeTabs';
import { plans } from '~/pages/UpgradePlan/plansData';
import { useDispatch, useSelector } from "react-redux";
import {createCheckoutSession} from '~/apis/Project/subscriptionApi'

const UpgradePlan = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState('Free');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  //
  const dispatch = useDispatch();
  const {accesstoken, userData } = useSelector(state => state.auth)


  const handleSubscription = async (_id) => {
    const data = {
      planId: _id,
      userId: userData?._id
    }
    // await dispatch(createCheckoutSessionAsync({accesstoken, data}));
    const response = await createCheckoutSession(accesstoken, data);
    if (response) {
      window.location.href = response
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <Button
          onClick={onClose}
          sx={{ minWidth: 'auto', p: 1 }}
        >
          <CloseIcon />
        </Button>
      </Box>

      <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
        <Typography variant="h4" component="h2">
          Upgrade your plan
        </Typography>
      </DialogTitle>

      <DialogContent>
        <PlanTypeTabs tabValue={tabValue} handleTabChange={handleTabChange} />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {plans.map((plan) => (
            <Grid item xs={12} md={4} key={plan._id}>
              <PlanCard
                plan={plan}
                isSelected={selectedPlan === plan.title}
                // isSelected={handleSubscription(accesstoken,plan._id)}
                onSelect={() => handleSubscription(plan._id)}
                isPopular={plan.isPopular}
              />
            </Grid>
          ))}
        </Grid>

        {/* <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Have an existing plan? See <Button variant="text" size="small" sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}>billing help</Button>
          </Typography>
        </Box> */}
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePlan;