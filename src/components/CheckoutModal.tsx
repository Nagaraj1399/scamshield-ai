import React, { useState } from "react";
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  Download,
  X,
  Sparkles,
  AlertCircle,
  Clock,
  ArrowRight,
  Terminal,
  Receipt,
  User,
} from "lucide-react";
import { PlanDefinition, ProjectPackageDefinition, PaymentTransaction, PlanTierId } from "../types";

interface CheckoutModalProps {
  item: {
    type: "SUBSCRIPTION" | "PROJECT_PACKAGE";
    data: PlanDefinition | ProjectPackageDefinition;
    billingCycle?: "monthly" | "annual";
  } | null;
  userEmail: string;
  onClose: () => void;
  onPaymentSuccess: (transaction: PaymentTransaction) => void;
}

export function CheckoutModal({
  item,
  userEmail,
  onClose,
  onPaymentSuccess,
}: CheckoutModalProps) {
  if (!item) return null;

  const [paymentMethod, setPaymentMethod] = useState<"CREDIT_CARD" | "UPI" | "CYBER_TOKEN">("CREDIT_CARD");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 9482");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [upiId, setUpiId] = useState(`${userEmail.split("@")[0]}@okaxis`);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<PaymentTransaction | null>(null);

  // Compute base price
  let basePrice = 0;
  let title = "";
  let subtitle = "";

  if (item.type === "SUBSCRIPTION") {
    const plan = item.data as PlanDefinition;
    basePrice = item.billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
    title = `${plan.name} (${item.billingCycle === "annual" ? "Annual Billing" : "Monthly Billing"})`;
    subtitle = plan.description;
  } else {
    const pkg = item.data as ProjectPackageDefinition;
    basePrice = pkg.price;
    title = `${pkg.title} [${pkg.codeName}]`;
    subtitle = pkg.description;
  }

  // Calculate discount
  const discount = couponApplied ? basePrice : 0;
  const finalPrice = Math.max(0, basePrice - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "DEFENSE100" || couponCode.trim().toUpperCase() === "FREE" || couponCode.trim().toUpperCase() === "CYBERPRO") {
      setCouponApplied(true);
    } else {
      alert("Invalid coupon. Try test code: DEFENSE100 for 100% demo waiver.");
    }
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const receiptNo = `RCPT-${Date.now().toString().slice(-6)}`;
      const txn: PaymentTransaction = {
        id: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        userId: "USR-SEC-94821",
        userEmail: userEmail,
        itemType: item.type,
        itemId: item.data.id,
        itemName: title,
        amount: finalPrice,
        currency: "USD",
        paymentMethod: finalPrice === 0 ? "FREE_CLAIM" : paymentMethod,
        status: "SUCCESS",
        receiptNumber: receiptNo,
      };

      setCompletedTxn(txn);
      setIsProcessing(false);
      onPaymentSuccess(txn);
    }, 1600);
  };

  const handleDownloadReceipt = () => {
    if (!completedTxn) return;
    const content = `
=====================================================
SCAMSHIELD ENGINE // FORENSIC PAYMENT AUDIT RECEIPT
=====================================================
RECEIPT NO   : ${completedTxn.receiptNumber}
TRANSACTION  : ${completedTxn.id}
TIMESTAMP    : ${new Date(completedTxn.timestamp).toLocaleString()}
USER ACCOUNT : ${completedTxn.userEmail}
ITEM NAME    : ${completedTxn.itemName}
ITEM TYPE    : ${completedTxn.itemType}
AMOUNT PAID  : $${completedTxn.amount.toFixed(2)} ${completedTxn.currency}
METHOD       : ${completedTxn.paymentMethod}
STATUS       : ${completedTxn.status}
SECURITY HASH: SHA256-${Math.random().toString(36).substring(2, 12)}
-----------------------------------------------------
STATUS: CREDENTIALS UNLOCKED & GRANTED FOR THIS USER
=====================================================
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${completedTxn.receiptNumber}-ScamShield-Receipt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-cyan-500/40 neural-glass p-5 sm:p-7 shadow-[0_0_50px_rgba(0,243,255,0.25)] overflow-hidden max-h-[92vh] overflow-y-auto hud-corner-tl">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-500 shadow-[0_0_12px_#00f3ff]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {!completedTxn ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  SECURE CHECKOUT TERMINAL
                </span>
                <h3 className="text-xl font-black text-white font-mono uppercase tracking-wide">
                  {item.type === "SUBSCRIPTION" ? "Upgrade Defense Plan" : "Unlock Project Tier"}
                </h3>
              </div>
            </div>

            {/* Item Order Summary Card */}
            <div className="rounded-2xl bg-slate-950/90 border border-cyan-500/30 p-4 mb-5 shadow-inner">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white font-mono">{title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-cyan-300 font-mono drop-shadow-[0_0_8px_#00f3ff]">
                    ${basePrice.toFixed(2)}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {item.type === "SUBSCRIPTION" ? (item.billingCycle === "annual" ? "per year" : "per month") : "one-time access"}
                  </span>
                </div>
              </div>

              {/* User Account Tracking Info */}
              <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <User className="h-3.5 w-3.5 text-cyan-400" /> Account Billed:
                </span>
                <span className="text-cyan-300 font-semibold">{userEmail}</span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <form onSubmit={handleApplyCoupon} className="mb-5 flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Promo / Voucher Code (Try DEFENSE100)"
                disabled={couponApplied}
                className="flex-1 rounded-xl bg-slate-950 border border-cyan-500/30 px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={couponApplied || !couponCode.trim()}
                className="rounded-xl bg-cyan-950 border border-cyan-500/40 px-3.5 py-2 text-xs font-bold font-mono text-cyan-300 hover:bg-cyan-900/60 transition-all disabled:opacity-50"
              >
                {couponApplied ? "Applied (100% OFF)" : "Apply Code"}
              </button>
            </form>

            {/* Payment Method Selector */}
            <div className="mb-5">
              <label className="block text-xs font-bold font-mono text-slate-300 uppercase mb-2">
                Select Payment Channel:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CREDIT_CARD")}
                  className={`p-3 rounded-xl border text-center font-mono text-xs transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === "CREDIT_CARD"
                      ? "bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="font-bold">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-3 rounded-xl border text-center font-mono text-xs transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === "UPI"
                      ? "bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  <span className="font-bold">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("CYBER_TOKEN")}
                  className={`p-3 rounded-xl border text-center font-mono text-xs transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === "CYBER_TOKEN"
                      ? "bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  <span className="font-bold">SOC Token</span>
                </button>
              </div>
            </div>

            {/* Payment Fields (Card / UPI / Token) */}
            <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 mb-5 font-mono text-xs">
              {paymentMethod === "CREDIT_CARD" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Card Number (Encrypted Token):</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Expiration (MM/YY):</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Security CVC:</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "UPI" && (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Virtual Payment Address (VPA / UPI ID):</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                  <p className="mt-2 text-[10px] text-slate-400">
                    Instant app notification will be routed to your UPI authorization device.
                  </p>
                </div>
              )}

              {paymentMethod === "CYBER_TOKEN" && (
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block">Available Organization SOC Credits:</span>
                    <span className="text-emerald-400 font-bold text-sm">25.00 CR (~ $25.00 USD)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-1 rounded">
                    CREDIT AUTO-APPLY
                  </span>
                </div>
              )}
            </div>

            {/* Total Price & Confirmation Button */}
            <div className="pt-3 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">Total Due Today:</span>
                <span className="text-2xl font-black text-white font-mono">
                  ${finalPrice.toFixed(2)}{" "}
                  {couponApplied && <span className="text-xs text-emerald-400 line-through">${basePrice.toFixed(2)}</span>}
                </span>
              </div>

              <button
                type="button"
                id="execute-checkout-btn"
                onClick={handleExecutePayment}
                disabled={isProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 px-6 py-3 text-xs font-black font-mono shadow-[0_0_20px_rgba(0,243,255,0.4)] active:scale-95 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>AUTHORIZING TLS LEDGER...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>{finalPrice === 0 ? "CLAIM & ACTIVATE NOW" : `AUTHORIZE PAYMENT ($${finalPrice.toFixed(2)})`}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Payment Success & Receipt Screen */
          <div className="text-center py-4 space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-950 border border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.4)] mb-2 animate-bounce">
              <CheckCircle2 className="h-9 w-9 text-emerald-400" />
            </div>

            <h3 className="text-2xl font-black text-white font-mono uppercase tracking-wide">
              Payment Confirmed & Tier Activated!
            </h3>
            <p className="text-xs text-cyan-300 font-mono">
              Transaction ID: {completedTxn.id} • Receipt #{completedTxn.receiptNumber}
            </p>

            {/* Receipt Summary Card */}
            <div className="rounded-2xl bg-slate-950/90 border border-emerald-500/30 p-4 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Purchased Item:</span>
                <span className="text-white font-bold">{completedTxn.itemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Licensee:</span>
                <span className="text-cyan-300">{completedTxn.userEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Billed:</span>
                <span className="text-emerald-400 font-black">${completedTxn.amount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Execution Status:</span>
                <span className="text-emerald-300 font-bold">ACTIVE & UNLOCKED</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleDownloadReceipt}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/40 bg-slate-950 px-4 py-2.5 text-xs font-semibold font-mono text-cyan-300 hover:text-white hover:bg-cyan-950/50 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Download Audit Receipt (.txt)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 px-6 py-2.5 text-xs font-bold font-mono transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                <span>Launch Security Engine</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
