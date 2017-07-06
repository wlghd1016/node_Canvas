
const mongoose = require( 'mongoose' );
const moment   = require( 'moment' );
const Schema   = mongoose.Schema;

// define schema
const userSchema = new Schema({

    // core fields
    username: { type: String, required: true },
    password: { type: String },

    // personal information
    friends: { type: Schema.Types.ObjectId, ref: 'User' },
    friends_reqs: [
          {
            user: {type: Schema.Types.ObjectId, ref: 'User'},
            request_state: Number
        }
    ],

    groups: {type: Schema.Types.ObjectId, ref: 'Group'},
    status: String,

}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

/**
 * Validator
 */

userSchema.path('username').validate(function (username) {
    return username.length;
}, '아이디를 입력 해주세요');


/**
 * Methods
 */
userSchema.methods = {

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
        if( this.profile.image ){
            return this.profile.image;
        } else{
            return "/images/profile-no-image-large.jpg";
        }
    },


}

/**
 * Statics
 */
userSchema.statics = {
    /**
     * Load User
     */
    load() {
        return this.find().exec();
    },

}


module.exports = mongoose.model( 'User', userSchema );

const User = mongoose.model('User');
