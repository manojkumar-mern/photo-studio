import Lead from '../models/Lead.js';

// Create a new wedding lead
export const createLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      weddingDate,
      weddingLocation,
      guestCount,
      packageInterest,
      requirements,
      source,
      sourceMedium,
      sourceCampaign,
      sourceContent,
      sourceTerm
    } = req.body;

    // 1. Basic required field validation
    if (!name || !phone || !weddingDate || !weddingLocation || !packageInterest) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, phone, wedding date, location, and package interest are required fields'
      });
    }

    // 2. Validate package interest option matches enum values
    const allowedPackages = ['Standard', 'Premium', 'Elite', 'Not Sure'];
    if (!allowedPackages.includes(packageInterest)) {
      return res.status(400).json({
        status: 'error',
        message: 'Package interest must be one of: Standard, Premium, Elite, or Not Sure'
      });
    }

    // 3. Simple backend deduplication to prevent double-clicks:
    // Check if a lead with the exact same phone, wedding date, and package interest
    // was submitted within the last 15 seconds.
    const parsedDate = new Date(weddingDate);
    const fifteenSecondsAgo = new Date(Date.now() - 15000);

    const duplicateLead = await Lead.findOne({
      phone,
      packageInterest,
      weddingDate: parsedDate,
      createdAt: { $gte: fifteenSecondsAgo }
    });

    if (duplicateLead) {
      return res.status(200).json({
        success: true,
        message: 'Your enquiry has been received successfully.'
      });
    }

    // 4. Create Lead document (Strictly mapping fields to prevent setting internal state like qualification/status)
    const newLead = new Lead({
      name,
      phone,
      email: email || undefined,
      weddingDate: parsedDate,
      weddingLocation,
      guestCount: guestCount !== undefined && guestCount !== '' ? Number(guestCount) : undefined,
      packageInterest,
      requirements,
      // Attribution data
      source: source || undefined,
      sourceMedium: sourceMedium || undefined,
      sourceCampaign: sourceCampaign || undefined,
      sourceContent: sourceContent || undefined,
      sourceTerm: sourceTerm || undefined,
      status: 'new', // Enforce 'new' status
      qualification: null // Enforce null qualification
    });

    await newLead.save();

    // 5. Clean success response without exposing internal database fields
    return res.status(201).json({
      success: true,
      message: 'Your enquiry has been received successfully.'
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join(', ')
      });
    }
    console.error('Error creating wedding lead:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong while sending your enquiry. Please try again.'
    });
  }
};
