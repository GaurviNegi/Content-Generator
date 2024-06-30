
const shouldRenewSubscriptionPlan = (user)=>{
    const todayDate = new Date();
    return !user?.nextBillingDate || user?.nextBillingDate <= todayDate;
}
module.exports = shouldRenewSubscriptionPlan;