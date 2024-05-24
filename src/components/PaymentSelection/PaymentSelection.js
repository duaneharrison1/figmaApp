import React from 'react';
import './PaymentSelection.css';
import { Modal } from 'react-bootstrap';
import ButtonColored from '../ButtonColored/ButtonColored';
import Check from '../../assets/images/check.png';
import WhiteCheck from '../../assets/images/white-check.png';
import freeImage from '../../assets/images/free-img@2x.png';
import BasicImage from '../../assets/images/basic-img@2x.png';
import ProImage from '../../assets/images/pro-img@2x.png';
import CloseIcon from '../../assets/images/close-icon.png';

import { useTranslation } from 'react-i18next';

const PaymentSelection = (props) => {
    const { show, handleClose, handleMonthlyPayment, handleYearlyPayment, monthlySubscription } = props;
    const { t } = useTranslation();

    const ManagePlan = () => {
        window.open('https://billing.stripe.com/p/login/cN24habbC4JMga44gg', '_blank');
    }

    const PlanCard = ({ planIcon, title, amount, month, billDesc, features, buttonLabel, buttonClass, onClick }) => (
        <div className='col-xl-4'>
            <div className={`plan-card ${buttonClass.includes('yearly') ? 'green-card' : 'regular-card'}`}>
                <img className='plan-icon' src={planIcon} alt={`${title} Plan`} />
                <h1 className={`payment-modal-selection-title${buttonClass.includes('yearly') ? '-yearly' : ''}`}>{title}</h1>

                <div className='amount-moonth-container'> 
                <div className='amount-per-month'>
                    <span className={`amount${buttonClass.includes('yearly') ? '-yearly' : ''}`}>{amount}</span>
                    <span className={`month${buttonClass.includes('yearly') ? '-yearly' : ''}`}>{month}</span>
                </div>
                <h4 className={`bill-desc${buttonClass.includes('yearly') ? '-yearly' : ''}`}>{billDesc}</h4>
                </div>
                <hr className= {`solid plancard-divider${buttonClass.includes('yearly') ? '-yearly' : ''}`} ></hr>
                <div className='payment-feature-container'>
                    {features.map((feature, index) => (
                        <div className="payment-feature" key={index}>
                            <img className='check-icon' src={buttonClass.includes('yearly') ? WhiteCheck : Check} alt='Check' />
                            <h4 className={`payment-feature-text${buttonClass.includes('yearly') ? '-yearly' : ''}`}>{feature}</h4>
                        </div>
                    ))}
                </div>
                <div className='button-upgrade-container'>
                    <ButtonColored className={buttonClass} label={buttonLabel} onClick={onClick} />
                </div>
            </div>
        </div>
    );

    const planData = [

        {
            planIcon: freeImage,
            title: t('free'),
            amount: '$0',
            month: '/month',
            billDesc: 'No bills, no frills.',
            features: [t('free-feat-one'), t('free-feat-two'), "Has 'Made with Figmafolio' label on site"],
            buttonLabel: t('current-plan'),
            buttonClass: 'btn-current-plan',
            onClick: null
        },
        {
            planIcon: BasicImage,
            title: 'Basic',
            amount: '$5',
            month: '/month',
            billDesc: 'Billed as 5 USD monthly after the trial period',
            features: [t('monthly-feat-one'), t('monthly-yearly-feat-two'), t('removes-made-with'), 'Customize Favicon'],
            buttonLabel: monthlySubscription === "monthlyPlan" ? t('current-plan') : "Start free 7 day trial",
            buttonClass: monthlySubscription === "monthlyPlan" ? 'btn-current-plan' : 'btn-upgrade-plan',
            onClick:  monthlySubscription === "monthlyPlan" ? ManagePlan : handleMonthlyPayment         
        },
        {
            planIcon: ProImage,
            title: 'Pro',
            amount: '$48',
            month: '/year',
            billDesc: 'Billed as a yearly payment of $48 USD after the trial period.',
            features: [t('yearly-feat-one'), t('monthly-yearly-feat-two'), t('removes-made-with'), 'Customize Favicon', t('monthly-yearly-feat-three')],
            buttonLabel: 'Start free 30 day trial',
            buttonClass: 'btn-upgrade-plan-yearly',
            onClick: handleYearlyPayment
        }
    ];

    const renderPlanCards = (filter) => (
        <div className='row justify-content-center'>
            {planData.filter(filter).map((plan, index) => (
                <PlanCard key={index} {...plan} />
            ))}
        </div>
    );


 
    return (
        <Modal dialogClassName='payment-selection-modal' show={show} onHide={handleClose}>
             <div className='close-container'> 
                <img className='' src={CloseIcon} alt='Close' onClick={handleClose} />
                </div>
            <div className='payment-modal-body'>
                <div className='payment-header-container'>
                    <h1 className='payment-modal-header'>Upgrade your Figmafolio account</h1>
                    <h1 className='payment-modal-sub-header'>Try it for free (7 or 30 days) and cancel anytime during the trial period.</h1>
                </div>

                {monthlySubscription === "monthlyPlan" && renderPlanCards(plan => plan.title !== 'Free')}
                {monthlySubscription === "annualPlan" && renderPlanCards(plan => plan.title !== 'Free')}
                {monthlySubscription !== "monthlyPlan" && monthlySubscription !== "annualPlan" && renderPlanCards(() => true)}
            </div>
        </Modal>
    );
};

export default PaymentSelection;
