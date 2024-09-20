
export const tiers = [
    {
      name: "Starter",
      price: { monthly: "$35", yearly: "$26" },
      frequency: { monthly: "month", yearly: "month billing yearly" },
      description: "Perfect for individuals and small projects.",
      features: [
        "100 AI generations per month",
        "Basic text-to-image conversion",
        "Email support",
        "Access to community forum",
      ],
      priceId: { monthly: "price_1PMaCZInpO8pfcCbVXFxsHyU", yearly: "price_1PMaCZInpO8pfcCbVXFxsHyU" },
      popular: false,
    },
    {
      name: "Pro",
      price: { monthly: "$59", yearly: "$44" },
      frequency: { monthly: "month", yearly: "month billing yearly" },
      description: "Ideal for professionals and growing businesses.",
      features: [
        "1000 AI generations per month",
        "Advanced text-to-image conversion",
        "Priority email support",
        "API access",
        "Custom AI model fine-tuning",
        "Collaboration tools",
      ],
      priceId: { monthly: "price_1PMaARInpO8pfcCbwakO7TcZ", yearly: "price_1PMaARInpO8pfcCbwakO7TcZ" },
      popular: true,
    },
    {
      name: "Enterprise",
      price: { monthly: "$99", yearly: "$74" },
      frequency: { monthly: "month", yearly: "month billing yearly" },
      description: "Tailored solutions for large organizations.",
      features: [
        "Unlimited AI generations",
        "Dedicated account manager",
        "24/7 phone and email support",
        "Custom AI model development",
        "On-premises deployment option",
        "Advanced analytics and reporting",
      ],
      priceId: { monthly: "price_1PMaBXInpO8pfcCbqO1CX0pZ", yearly: "price_1PMaBXInpO8pfcCbqO1CX0pZ" },
      popular: false,
    },
  ];
  

  export const features = [
    "Core features",
    "Advanced analytics",
    "Priority support",
    "Custom integrations",
    "API access",
    "Enterprise security",
    "Dedicated account manager",
    "Custom contracts",
    "SLA guarantees",
  ];
  
  export const featureAvailability = [
    [true, true, true],
    [true, true, true],
    [false, true, true],
    ["Limited", "Full", "Full"],
    [false, true, true],
    [false, true, true],
    [false, false, true],
    [false, false, true],
    [false, false, true],
  ];