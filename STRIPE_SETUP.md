# Stripe Payment Integration Setup

## 🔑 **Required Stripe Keys**

To enable 4K download payments, you need to add your Stripe keys to Vercel:

### **1. Get Stripe Keys**
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### **2. Add to Vercel Environment Variables**
```bash
# Add to Vercel (replace with your actual keys)
vercel env add STRIPE_SECRET_KEY production
# Enter: sk_test_your_actual_secret_key_here

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# Enter: pk_test_your_actual_publishable_key_here
```

### **3. Test Payment Flow**
1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future date for expiry
3. Any 3-digit CVC
4. Any ZIP code

## 💰 **Revenue Features**
- ✅ **4K Downloads** - $2.99 per download
- ✅ **Print-on-Demand** - Integrated with Printful
- ✅ **Secure Payments** - Stripe powered
- ✅ **Professional UI** - Payment modal with card input

## 🚀 **Production Setup**
1. **Switch to Live Keys** in Stripe dashboard
2. **Update Environment Variables** with live keys
3. **Test with Real Cards** (small amounts first)
4. **Monitor Transactions** in Stripe dashboard

## 📊 **Expected Revenue**
- **Standard Downloads**: Free (lead generation)
- **4K Downloads**: $2.99 each
- **Print Products**: $15-30 each (via Printful)
- **Conversion Rate**: 5-15% of users typically upgrade
