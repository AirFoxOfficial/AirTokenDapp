<template>
    <div>
        <div v-if="showOtpForm">
            <h1>Phone confirmation</h1>
            <div class="form-group">
                <label for="phone">Phone number</label>
                <input name="phone" class="form-control" type="text" v-model="form.phone" />
            </div>
            <button type="button" class="btn btn-info" @click="generateOtpCode">Generate code</button>
            <div class="form-group" v-if="otpGenerated">
                <label for="otp">Insert code</label>
                <input name="otp" class="form-control" type="text" v-model="otpCode" />
            </div>
            <button type="button" class="btn btn-info" @click="confirmOtpCode">Confirm code</button>
        </div>
        <div v-else>
            <h1>Account registration</h1>
            <form class="new-account">
                <div class="form-group">
                    <label for="firstName">First name</label>
                    <input name="firstName" class="form-control" type="text" v-model="form.first_name" />
                </div>
                <div class="form-group">
                    <label for="lastName">Last name</label>
                    <input name="lastName" class="form-control" type="text" v-model="form.last_name" />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input name="email" class="form-control" type="text" v-model="form.email" />
                </div>
                <div class="form-group">
                    <label for="address">Address</label>
                    <input name="address" class="form-control" type="text" v-model="form.address" />
                </div>
                <div class="form-group">
                    <label for="country">Country</label>
                    <select name="country" class="form-control" v-model="form.country">
                        <option v-for="country in countriesKeys" v-bind:value="country">
                            {{ countries[country] }}
                        </option>
                    </select>
                </div>
                <button type="button" class="btn btn-info" @click="submit">Submit</button>
            </form>
        </div>
    </div>
</template>

<script>
import {getUserAccountInfo,updateUserAccountInfo,getLoggedUser,userKycCompleted,generateOtp,confirmOtp} from '../services/ums';
import {errorHandler} from '../utils/handler';
import countries from '../constants/countries';

const DEVICE_ID = process.env.DEVICE_ID;

export default {
    name: 'Account',
    data () {
        return {
            countries: countries,
            countriesKeys: [],
            otpInProgress: true,
            otpGenerated: false,
            otpCode: '',
            form: {
                address: '',
                country: '',
                first_name: '',
                last_name: '',
                email: '',
                phone: ''
            }
        }
    },
    methods: {
        generateOtpCode() {
            const self = this;
            const body = {
                phone_number: self.form.phone,
                device_id: DEVICE_ID
            };
            emitLoading(true);
            generateOtp(body)
                .then(result => {
                    if (!result.data.status) {
                        throw new Error(result.data.error.message);
                    } else {
                        self.otpGenerated = true;
                        emitLoading(false);
                    }
                }, err => {
                    throw err;
                })
                .catch(e => {
                    errorHandler({
                        message: `Error while generating OTP: ${e.message}`,
                        level: 'error',
                        emitLoading: false
                    });
                })
        },
        confirmOtpCode() {
            const self = this;
            const body = {
                otp: self.otpCode,
                device_id: DEVICE_ID
            };
            emitLoading(true);
            confirmOtp(body)
                .then(result => {
                    emitLoading(false);
                    self.otpInProgress = !result.data.status;
                }, err => {
                    throw err;
                })
                .catch(e => {
                    errorHandler({
                        message: `Error while confirming OTP: ${e.message}`,
                        level: 'error',
                        emitLoading: false
                    });
                });
        },
        submit () {
            emitLoading(true);
            updateUserAccountInfo(this.form)
                .then(() => {
                    this.$router.push(this.$route.query.redirect || '/');
                    emitLoading(false);
                })
                .catch(e => {
                    errorHandler({
                        message: `Error while registering account: ${e.message}`,
                        level: 'error',
                        emitLoading: false
                    });
                });
        }
    },
    created () {
        this.countriesKeys = Object.keys(countries);
        const loggedUser = getLoggedUser();
        if (loggedUser) {
            this.form.address = loggedUser.address;
            this.form.country = loggedUser.country;
            this.form.first_name = loggedUser.firstName;
            this.form.last_name = loggedUser.lastName;
            this.form.email = loggedUser.email;
            this.form.phone = loggedUser.phone;
            this.otpInProgress = !(loggedUser.phone && loggedUser.user_otp.is_validated);
        }
        if (userKycCompleted()) {
            this.$router.push(this.$route.query.redirect || '/');
        }
    },
    computed: {
        showOtpForm() {
            return this.otpInProgress
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
