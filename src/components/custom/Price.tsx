import { useContext, useEffect, useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { calculateDiscountedPrice, calculateImpact, extractBAToken } from '@/lib/utils';
import { UserContext } from '@/context/userContext';
import { usePriceContext } from '@/context/pricingContext';
import { motion } from 'framer-motion';
import FAQSection from './FAQ';

const pricingPlans = [
	{
		name: 'Just Mates',
		price: 'Free',
		description: ' Plan a job, zero cost.',
		features: [
			'Ask Matey right on the homepage',
			'10 free chats to plan your project',
			'See price ranges, not brand hype',
			'Session memory for quick repeats',
			'Tool checklist so you don’t miss gear',
		],
		cta: 'Stick With Freebie',
		highlight: false,
	},
	{
		name: 'Best Mates',
		price: '$10/month',
		description: 'Unlock the lot for less than a snag a month.',
		features: [
			'Unlimited chats, full project help',
			'Snap a photo, skip the guesswork',
			'Matey tracks your tools, old and new',
			'Advice sharpens after every chat',
			' Buy once, not twice and save cash',
		],
		cta: 'Upgrade to Best Mate',
		highlight: true,
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
			delayChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: { y: 50, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring',
			stiffness: 100,
			damping: 15,
		},
	},
};

const featureVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: (i) => ({
		opacity: 1,
		x: 0,
		transition: {
			type: 'spring',
			stiffness: 100,
			damping: 10,
			delay: i * 0.1,
		},
	}),
};

export default function Price() {
	const location = useLocation();
	const currRoute = location.pathname;
	const { priceData } = usePriceContext();
	const queryParams = new URLSearchParams(location.search);
	const redirected = queryParams.get('redirected');
	const [isShowContinueWithFree, setIsShowContinueWithFree] = useState(false);
	const { isSignedIn } = useUser();
	const { userData } = useContext(UserContext);
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('month');
	const [activePlan, setActivePlan] = useState<any>(null);
	const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
	const [continueToDashboard, setContinueToDashboard] = useState(false);
	const [couponCode, setCouponCode] = useState('');
	const [couponCodeDebouce] = useDebounce(couponCode, 1000);
	const [couponCodeValidationLoading, setCouponCodeValidationLoading] = useState(false);
	const [couponCodeError, setCouponCodeError] = useState('');
	const [couponCodeMessage, setCouponCodeMessage] = useState('');
	const [isCouponApplied, setIsCouponApplied] = useState(false);
	const [isCouponActive, setIsCouponActive] = useState(false);
	const [couponCodeDiscountPrice, setCouponCodeDiscountPrice] = useState(0);
	const [couponCodeImpact, setCouponCodeImpact] = useState(0);
	const [couponCodeDiscountPercentage, setCouponCodeDiscountPercentage] = useState(0);
	const [showDrawer, setShowDrawer] = useState(false);
	const [paypalLoading, setPaypalLoading] = useState(false);
	const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
	const locations = useLocation();
	useEffect(() => {
		if (redirected) {
			setIsShowContinueWithFree(true);
		}
		return () => {
			setIsShowContinueWithFree(false);
		};
	}, [redirected]);

	const { toast } = useToast();

	useEffect(() => {
		if (redirected) {
			setContinueToDashboard(true);
		}
	}, [redirected]);

	const handleTabChange = (value: any) => setActiveTab(value);

	const handleBuyNow = (planValue: string) => {
		if (!isSignedIn) {
			toast({
				title: 'Error',
				description: 'Please Sign In To Complete The Purchase',
				variant: 'destructive',
			});
			navigate('/signup');
			return;
		}
		const activeTabObject: any = priceData.find((item: any) => item.tabName === activeTab);
		if (activeTabObject) {
			const activePlanObject = activeTabObject.list.find((item: any) => item.planValue === planValue);
			setActivePlan({ ...activePlanObject, duration: activeTabObject.tabName });
			console.log('activePlanObject', {
				...activePlanObject,
				duration: activeTabObject.tabName,
			});
		}

		if (window.innerWidth <= 768) {
			setShowDrawer(true);
		} else {
			setShowCheckoutPopup(true);
		}
	};

	const handleCouponCode = (data: string) => setCouponCode(data);

	useEffect(() => {
		async function validateCouponCode() {
			setCouponCodeMessage('');
			setCouponCodeError('');
			setCouponCodeValidationLoading(true);

			try {
				const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/getCouponCodeValidation`, {
					code: couponCodeDebouce,
				});
				const { success, validationMessage, discount } = data;

				if (!success) {
					resetCouponState(validationMessage);
					return;
				}

				const priceDiscountImpact = calculateImpact(activePlan.priceInt, discount);
				const finalPrice = calculateDiscountedPrice(activePlan.priceInt, discount);

				setCouponCodeDiscountPrice(Number(finalPrice));
				setCouponCodeDiscountPercentage(discount);
				setCouponCodeImpact(Number(priceDiscountImpact));
				setCouponCodeMessage(validationMessage);
				setIsCouponApplied(true);
			} catch (error) {
				resetCouponState('Something went wrong. Please try again later.');
			} finally {
				setCouponCodeValidationLoading(false);
			}
		}

		if (couponCodeDebouce.length !== 0) {
			validateCouponCode();
		}
	}, [couponCodeDebouce]);

	const resetCouponState = (message: string) => {
		setCouponCodeValidationLoading(false);
		setCouponCodeMessage('');
		setCouponCodeDiscountPrice(0);
		setCouponCodeDiscountPercentage(0);
		setCouponCodeImpact(0);
		setCouponCodeError(message);
		setIsCouponActive(false);
		setIsCouponApplied(false);
	};

	const handleCouponApplied = () => {
		if (isCouponApplied) {
			setIsCouponActive(!isCouponActive);
		}
	};

	const handlePriceDialogClose = (value: boolean) => {
		if (!value) {
			setCouponCode('');
			resetCouponState('');
			setShowCheckoutPopup(false);
		}
	};

	async function getPaypalUrl() {
		if (paypalLoading) {
			return;
		}
		if (!isSignedIn) {
			toast({
				title: 'Error',
				description: 'Please Sign In To Complete The Purchase',
				variant: 'destructive',
			});
			navigate('/signup');
			return;
		}
		setPaypalLoading(true);
		try {
			console.log('isCouponApplied', isCouponApplied, 'isCouponActive', isCouponActive);
			let url;
			if (isCouponApplied && isCouponActive) {
				console.log('activePlan', activePlan, userData);
				const discountPayPal = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/payment`, {
					productId: activePlan.productId,
					userId: userData?.id,
					isCouponCodeApplied: true,
					planName: activePlan.title,
					CouponCode: couponCode,
				});

				url = discountPayPal.data.url;
				console.log('url', url);
				const urlBaValue = extractBAToken(url);
				const localValue = {
					ba: urlBaValue,
					Packname: activePlan.title,
					price: activePlan.price,
				};
				localStorage.setItem('paypalData', JSON.stringify(localValue));
				window.location.href = url; // Redirect to PayPal URL directly

				console.log('discountPayPal', discountPayPal);
			} else {
				console.log('activePlan', activePlan, userData);
				const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/payment`, {
					productId: activePlan.productId,
					userId: userData?.id,
					isCouponCodeApplied: false,
					CouponCode: null,
					planName: activePlan.title,
				});
				url = res.data.url;
				console.log('url', url);
				const urlBaValue = extractBAToken(url);
				const localValue = {
					ba: urlBaValue,
					Packname: activePlan.title,
					price: activePlan.price,
				};
				localStorage.setItem('paypalData', JSON.stringify(localValue));
				window.location.href = url;

				console.log('res', res);
			}
		} catch (error) {
			console.error('Error fetching PayPal URL', error);
		} finally {
			setPaypalLoading(false);
		}
	}

	return (
		<div className=''>
			<motion.div
				className={`w-full h-full md:py-10 ${
					locations.pathname === '/pricing' ? '' : 'px-4'
				} sm:px-6 lg:px-8 max-w-7xl mx-auto`}
				variants={containerVariants}
				initial='hidden'
				animate='visible'>
				<motion.div className='text-center mb-16' variants={itemVariants}>
					<motion.p
						className='text-gray text-lg max-w-2xl mx-auto'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.6 }}>
						No lock-ins. No pressure. Just choose what suits you best.
					</motion.p>
				</motion.div>

				<motion.div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto' variants={containerVariants}>
					{pricingPlans.map((plan, index) => (
						<motion.div
							key={index}
							className={`relative bg-white shadow-md border border-gray-200 rounded-2xl overflow-hidden`}
							whileHover={{
								y: -8,
								transition: { duration: 0.3 },
							}}
							onMouseEnter={() => setHoveredPlan(index)}
							onMouseLeave={() => setHoveredPlan(null)}>
							{plan.highlight && (
								<motion.div
									className='absolute top-0 right-0 left-0 bg-gradient-to-r from-orange to-lightOrange text-white text-center py-2 font-medium text-sm'
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5, duration: 0.4 }}>
									<div className='flex items-center justify-center space-x-2'>
										<motion.div>
											<Sparkles size={16} className='text-yellow' />
										</motion.div>
										<span>BEST MATE TIER</span>
										<motion.div>
											<Sparkles size={16} className='text-yellow' />
										</motion.div>
									</div>
								</motion.div>
							)}

							<div className={`p-8 ${plan.highlight ? 'pt-14' : 'md:pt-[3.6rem]'} h-full flex flex-col`}>
								{/* Main content */}
								<div className='flex-grow flex flex-col'>
									<div>
										<div className='flex justify-center'>
											<h3 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>{plan.name}</h3>
										</div>
										<p className='text-gray mb-6'>{plan.description}</p>
										<div className='mb-8'>
											<div className='text-5xl font-extrabold text-orange mb-1'>{plan.price}</div>
											{plan.price !== 'Free' ? (
												<div className='text-gray-500 text-sm'>
													<p>Average user saves $40 on their first project</p>
													Billed {activeTab === 'month' ? 'monthly' : 'annually'}
												</div>
											) : (
												<div className='text-gray-500 text-sm h-[16px]'></div>
											)}
										</div>
									</div>

									<motion.div className='mb-8' variants={containerVariants} initial='hidden' animate='visible'>
										<div className='mb-4 font-medium text-gray-700'>What's included:</div>
										<ul className='space-y-4'>
											{plan.features.map((feature, i) => (
												<motion.li key={i} className='flex items-start' custom={i} variants={featureVariants}>
													<div className='flex-shrink-0 h-6 w-6 rounded-full bg-paleYellow flex items-center justify-center mr-3'>
														<Check size={14} className='text-orange' />
													</div>
													<span className='text-gray-700 text-start'>{feature}</span>
												</motion.li>
											))}
										</ul>
									</motion.div>
								</div>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className={`mt-auto ${plan.highlight ? '' : 'md:pt-[1.2rem]'}`}>
									<Button
										className={`w-full py-6 rounded-xl text-base font-semibold transition-all duration-300 ${
											plan.highlight
												? 'bg-gradient-to-r from-orange to-lightOrange hover:from-lightOrange hover:to-orange text-white shadow-lg shadow-paleYellow'
												: 'bg-white border-2 border-orange-500 text-orange hover:bg-paleYellow'
										}`}>
										<span className='flex items-center justify-center'>
											{plan.cta}
											<ArrowRight className='ml-2 h-5 w-5' />
										</span>
									</Button>
								</motion.div>
							</div>
						</motion.div>
					))}
				</motion.div>

				<motion.div
					className='mt-16 text-center'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1, duration: 0.8 }}>
					<p className='text-gray mb-2'>All plans come with a 14-day money-back guarantee.</p>
					<p className='text-sm text-gray-500'>Cancel anytime, no worries.</p>
				</motion.div>

				<FAQSection isVisible={currRoute == '/'} />
			</motion.div>
		</div>
	);
}