// UpgradePlanDialog.jsx
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Typography,
  Grid,
  IconButton,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlanCard from '~/pages/UpgradePlan/PlanCard';
import PlanTypeTabs from '~/pages/UpgradePlan/PlanTypeTabs';
import { useDispatch, useSelector } from "react-redux";
import { createCheckoutSession } from '~/apis/Project/subscriptionApi'
import { getAllSubPlan } from '~/apis/Project/subscriptionPlan';

import { getSubscriptionByUserThunks } from '~/redux/project/subscription-slice'

const UpgradePlan = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subPlan, setSubPlan] = useState(null);
  const [processingSubscription, setProcessingSubscription] = useState(false);

  const dispatch = useDispatch();
  const { accesstoken, userData } = useSelector(state => state.auth);
  const subscription = useSelector(state => state.subscription.subscription);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await getAllSubPlan(accesstoken);
        setSubPlan(data);
      } catch (error) {
        console.error("Error fetching subscription plans:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [accesstoken]);

  useEffect(() => {
    const fetchUserSubscriptions = async () => {
      try {
        if (userData && userData._id) {
          await dispatch(getSubscriptionByUserThunks({ accesstoken, userId: userData._id })).unwrap();
        }
      } catch (error) {
        console.error("Error fetching subscription fetchUserSubscriptions:", error.message);
      }
    };

    if (userData?._id) {
      fetchUserSubscriptions();
    }
  }, [accesstoken, userData, dispatch]);





  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

    const handleSubscription = async (planId) => {
      try {
        setProcessingSubscription(true);

        // Check if this is the current plan
        const currentPlanId = userData?.subscription?.plan;
        if (currentPlanId === planId) {
          // User is trying to subscribe to the same plan
          // You could show a message or handle this case
          return;
        }

        const data = {
          planId: planId,
          userId: userData?._id
        };

        localStorage.setItem('pendingSubscription', JSON.stringify(data));

        const response = await createCheckoutSession(accesstoken, data);
        if (response) {
          window.location.href = response;
        }
      } catch (error) {
        console.error("Error creating checkout session:", error.message);
      } finally {
        setProcessingSubscription(false);
      }
    };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
          zIndex: 1
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle sx={{ textAlign: 'center', mt: 2, pb: 0 }}>
        <Typography variant="h4" component="h2">
          Upgrade your plan
        </Typography>
      </DialogTitle>

      <DialogContent>
        <PlanTypeTabs tabValue={tabValue} handleTabChange={handleTabChange} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {subPlan?.plans?.map((plan) => {
              const isCurrent =  subscription?.data[0]?.plan_id._id === plan._id && subscription?.data[0]?.user_id=== userData?._id;
              return (
                <Grid item xs={12} md={6} key={plan._id}>
                  <PlanCard
                    plan={plan}
                    isSelected={isCurrent}
                    onSelect={() => handleSelectPlan(plan.subscription_type)}
                    onSubscribe={() => handleSubscription(plan._id)}
                    isPopular={plan.isPopular}
                    isCurrent={isCurrent}
                    processingSubscription={processingSubscription}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePlan;