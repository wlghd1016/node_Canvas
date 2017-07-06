
const mongoose = require( 'mongoose' );
const moment   = require( 'moment' );
const Schema   = mongoose.Schema;

// define schema
const imageFileSchema = new Schema({

    // core fields
    resize_stage: Number,
    x_axis: Number,
    y_axis: Number,
    height: Number,
    width: Number,
    file_path: String,

}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

/**
 * Validator
 */

/**
 * Methods
 */
imageFileSchema.methods = {

    /**
     * Generate Hash
     */
    // passwordUpdate( password ) {
    //     let user = this;
    //
    //     bcrypt.genSalt( SALT_WALK_FACTOR, function( err, salt ) {
    //         bcrypt.hash( password, salt, function( err, hash ) {
    //             user.password = hash;
    //             user.save();
    //         });
    //     });
    // },

    /**
     * Date
     */
    getCreatedAt() {
        return moment( this.created_at ).format('YYYY-MM-DD, hh:mm:ss a')
    },
    /**
     * Get Image
     */
    getImageURL( type ) {
        if( this.file_path ){
            return this.file_path;
        } else{
            return "/images/profile-no-image-large.jpg";
        }
    },


}

/**
 * Statics
 */
imageFileSchema.statics = {
    /**
     * Load User
     */
    load() {
        return this.find().exec();
    },

}

// const ImageFile = mongoose.model('ImageFile');

module.exports = mongoose.model( 'ImageFile', imageFileSchema );
