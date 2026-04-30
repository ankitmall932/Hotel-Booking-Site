import Listing from "../models/listing.model.js";
import { locationData } from "../data/location.js";
import cloudinary from "../config/cloudinary.js";
import { uploadFromBuffer } from "../config/cloudinaryUpload.js";
import Booking from "../models/booking.model.js";

export const createListing = async (req, res, next) => {
    try
    {
        const uploadedImages = [];
        for (let file of req.files || [])
        {
            const result = await uploadFromBuffer(file.buffer);
            uploadedImages.push({
                url: result.secure_url,
                public_id: result.public_id,
            });
        }
        const { name, description, price, city, state, country } = req.body;
        let amenities = [];
        if (req.body.amenities || req.body[ 'amenities[]' ])
        {
            try
            {
                amenities = JSON.parse(req.body.amenities || req.body[ 'amenities[]' ]);
            } catch (err)
            {
                console.log(err);
                amenities = [];
            }
        }
        if (!locationData[ state ]?.includes(city?.trim()))
        {
            return res.status(400).json({
                message: 'Invalid city'
            });
        } // just for backend security
        const listing = await Listing.create({
            name,
            description,
            price,
            amenities,
            images: uploadedImages,
            owner: req.user._id,
            location: {
                city,
                state,
                country
            },
        });
        return res.status(201).json({
            success: true,
            listing
        });
    } catch (err)
    {
        next(err);
    }
};

export const countryData = (req, res) => {
    res.json(locationData);
};

export const getUserListing = async (req, res, next) => {
    try
    {
        const listing = await Listing.find({ owner: req.user._id });
        if (!listing || listing.length === 0)
        {
            return res.status(400).json({
                message: 'No listing found'
            });
        }
        return res.status(200).json({
            message: 'Your Listings',
            listings: listing
        });
    } catch (err)
    {
        next(err);
    }
};

export const detailListing = async (req, res, next) => {
    try
    {
        const listing = await Listing.findById(req.params.id).populate('owner');
        if (!listing)
        {
            return res.status(404).json({
                message: 'Listing not found or access denied'
            });
        }
        return res.status(200).json({
            message: 'This is your listing',
            listing: listing
        });
    } catch (err)
    {
        next(err);
    }
};

export const imagePreview = async (req, res, next) => {
    try
    {
        const listing = await Listing.findOne({ 'images._id': req.params.id });
        if (!listing)
        {
            res.status(404).json({
                message: 'listing not found'
            });
        }
        const image = listing.images.id(req.params.id);
        if (!image)
        {
            return res.status(404).json({
                message: 'Image not found'
            });
        }
        return res.status(200).json({
            message: 'Your Image',
            image: image
        });
    } catch (err)
    {
        next(err);
    }
};//common in user\\customer also

export const updateListing = async (req, res, next) => {
    try
    {
        const listing = await Listing.findById(req.params.id);
        if (!listing)
        {
            return res.status(404).json({
                message: 'Listing not found'
            });
        }
        // Handle image uploads if provided
        if (req.files && req.files.length > 0)
        {
            const uploadedImages = [];
            for (let file of req.files)
            {
                const result = await uploadFromBuffer(file.buffer);
                uploadedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
            listing.images = uploadedImages;
        }
        // Update basic fields
        const { name, description, price, city, state, country } = req.body;
        if (name) listing.name = name;
        if (description) listing.description = description;
        if (price) listing.price = price;
        // Update location if provided
        if (city || state || country)
        {
            if (city && state && !locationData[ state ]?.includes(city?.trim()))
            {
                return res.status(400).json({
                    message: 'Invalid city'
                });
            }
            listing.location = {
                city: city || listing.location.city,
                state: state || listing.location.state,
                country: country || listing.location.country
            };
        }
        // Update amenities if provided
        if (req.body.amenities)
        {
            try
            {
                let amenities = [];
                if (typeof req.body.amenities === 'string')
                {
                    amenities = JSON.parse(req.body.amenities);
                } else
                {
                    amenities = req.body.amenities;
                }
                listing.amenities = amenities;
            } catch (err)
            {
                console.log(err);
            }
        }
        await listing.save();
        return res.status(200).json({
            message: 'Successfully Updated',
            listing
        });
    } catch (err)
    {
        next(err);
    }
};

export const deleteListing = async (req, res, next) => {
    try
    {
        const listing = await Listing.findByIdAndDelete(req.params.id);
        if (!listing)
        {
            return res.status(404).json({
                message: 'Listing not found'
            });
        }
        res.json({ message: 'Listing deleted successfully' });
    } catch (err)
    {
        next(err);
    }
};

export const getOwnerBookings = async (req, res, next) => {
    try
    {
        const bookings = await Booking.find({ owner: req.user._id }).populate('user').populate('listing');
        if (!bookings || bookings.length === 0)
        {
            return res.status(400).json({
                message: 'No booking found'
            });
        }
        return res.status(200).json({
            message: 'Your Bookings',
            bookings
        });
    } catch (err)
    {
        next(err);
    }
};
