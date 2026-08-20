import Lead from '../models/Lead.js';
import Booking from '../models/Booking.js';

/**
 * Higher-order controller function to update the delivery status of portfolio or quotation
 * for either a Lead or Booking entity.
 * 
 * @param {string} modelType - Either 'Lead' or 'Booking'
 * @param {string} deliveryType - Either 'portfolio' or 'quotation'
 */
export const updateDeliveryStatus = (modelType, deliveryType) => async (req, res) => {
  try {
    const { id } = req.params;
    const { status, lastError, attempts } = req.body;

    if (!status || !['pending', 'sent', 'failed'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid delivery status. Must be pending, sent, or failed'
      });
    }

    const Model = modelType === 'Lead' ? Lead : Booking;

    const updateFields = {
      [`${deliveryType}.status`]: status,
      [`${deliveryType}.lastAttemptAt`]: new Date(),
      [`${deliveryType}.lastError`]: lastError || null
    };

    if (attempts !== undefined) {
      updateFields[`${deliveryType}.attempts`] = Number(attempts);
    }

    if (status === 'sent') {
      updateFields[`${deliveryType}.sentAt`] = new Date();
      updateFields[`${deliveryType}.lastError`] = null;
    }

    const updatedDocument = await Model.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({
        status: 'error',
        message: `${modelType} not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: `${deliveryType} delivery status updated successfully`,
      data: {
        id: updatedDocument._id,
        [deliveryType]: updatedDocument[deliveryType]
      }
    });

  } catch (error) {
    console.error(`Error updating ${modelType} ${deliveryType} delivery status:`, error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating delivery status'
    });
  }
};
