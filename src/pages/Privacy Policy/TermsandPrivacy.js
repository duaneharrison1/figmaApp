import React, { useState } from 'react';
import "./TermsandPrivacy.css";
export default function PrivacyPolicy() {
    return (
        <>

            <div className='terms-and-privacy-body'>
                <h1 className='terms-and-privacy-header'>Terms and Conditions</h1>

                <h1 className='terms-and-privacy-subheader'>Using the Site</h1>
                <p>The Site allows users ("Users" or "you") to share, display and promote visual design portfolios and connect with others in the design community. By using the Site, you represent that you have the authority to enter into this Agreement personally or on behalf of the entity you have named as the User, and that you or the entity will be financially responsible for your use of the Site.</p>
                <h1 className='terms-and-privacy-subheader'>Changes to Terms</h1>
                <p>We may modify this Agreement from time to time and such modification shall be effective upon posting on the Site. You agree to be bound to any changes to this Agreement when you use the Site after any such modification is posted. It is important that you review this Agreement regularly to ensure you are updated as to any changes.</p>
                <h1 className='terms-and-privacy-subheader'>Subscriptions</h1>
                <p>Parts of the Site and Service are only available with a paid subscription plan, offered on a monthly or yearly basis (the “Subscription”). Your Subscription will automatically renew at the end of each subscription period unless cancelled by you or terminated by the Company.</p>
                <h3 className="terms-and-privacy-title">Subscription Cancellation</h3>
                <p>You may cancel the automatic renewal of your Subscription either through your Account Settings page or by contacting the Company at support[at]figmafolio.com. You will not receive a refund for subscription fees already paid for your then-current subscription period and you will be able to access the Service until the end of the subscription period.</p>
                <h3 className="terms-and-privacy-title">Refunds</h3>
                <p>Except when required by law, paid Subscription fees are generally non-refundable. Certain refund requests may be considered by the Company on a case-by-case basis and granted at the sole discretion of the Company.</p>
                <h1 className='terms-and-privacy-subheader'>Access and Use</h1>
                <p>We grant you permission to use the Site subject to the restrictions in this Agreement. By using the Site, you are representing that you have the authority as per this Agreement. Use of the Site is void where prohibited. We retain the right to deny access to anyone at any time without notice for any reason. You agree not to access the Site by any means other than a standard browser interface. Any automated use of a system or process to access, acquire, copy or monitor any part of the Site or its content is strictly prohibited.</p>
                <h1 className='terms-and-privacy-subheader'>Content</h1>
                <p>You are solely responsible for any content you upload, publish, display, link to, or otherwise make available on the Site (“Content”).</p>
                <h3 className="terms-and-privacy-title">Content Backups</h3>
                <p>We make reasonable efforts to back up data and Content stored on our servers but do not guarantee its protection or recovery in the event of loss. It is your sole responsibility to independently back up any important Content.</p>
                <h1 className='terms-and-privacy-subheader'>Limitation of Liability</h1>
                <p>THE SITE AND ALL INFORMATION, CONTENT AND MATERIALS ARE PROVIDED ON AN "AS IS" BASIS WITHOUT WARRANTIES OF ANY KIND. WE ARE NOT LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL OR CONSEQUENTIAL LOSS, DAMAGE, COST OR EXPENSE RELATING TO ANY USE OF THE SITE.</p>
                <h1 className='terms-and-privacy-subheader'>Indemnification</h1>
                <p>You agree to defend, indemnify and hold us harmless, and our subsidiaries, affiliates, officers, directors, agents, and co-branders from any claim, demand, damages or other losses, including reasonable attorneys' fees, asserted by any third party or arising out of your use of the Site or breach of this Agreement.</p>
                <h1 className='terms-and-privacy-subheader'>Intellectual Property</h1>
                <p>The Site may contain intellectual property that is owned by us or third parties including copyrights, trademarks, trade secrets and patents. You must respect these ownership rights. You agree not to copy, download, mirror, modify, reverse engineer, access or use any portions of the Site, including content, graphics and functional elements for any commercial purposes or redistribution.</p>
                <h1 className='terms-and-privacy-subheader'>Privacy</h1>
                <p>Please review our Privacy Policy to understand how we collect and use information about you when you access or use our Site. The Privacy Policy is part of this Agreement.</p>
                <h1 className='terms-and-privacy-subheader'>Termination</h1>
                <p>We reserve the right to suspend, deactivate or delete your account if we determine you have violated this Agreement. We are not liable to you or any third party as a result of exercising this right. If feasible, we will provide you notice of our intention to suspend, deactivate or delete your account. Parts of this Agreement shall continue to be enforceable after termination by either party.</p>
                <h1 className='terms-and-privacy-subheader'>Governing Law and Jurisdiction</h1>
                <p>This Agreement is governed under the laws of [Governing Law State], without regard to its conflict of law provisions. Sole and exclusive jurisdiction for any action or proceeding arising out of or related to this Agreement shall be an appropriate state or federal court located in [Jurisdiction City/County and State].</p>
                <h1 className='terms-and-privacy-subheader'>Severability</h1>
                <p>If any part of this Agreement is determined by a court of competent jurisdiction to be invalid or unenforceable under applicable law, the invalid or unenforceable provision will be modified to the minimum extent necessary to make it valid and enforceable or, if that is not possible, it shall be severed from this Agreement.</p>
                <h1 className='terms-and-privacy-subheader'>Complete Agreement</h1>
                <p>This Agreement constitutes the entire agreement between you and us. It supersedes all prior or contemporaneous communications and proposals, whether electronic, oral, or written. Notwithstanding the foregoing, any additional terms and services may exist on the Site which govern your use of those specific additional terms and services.</p>
                <h1 className='terms-and-privacy-subheader'>Acceptable Use Policy</h1>
                <p>You agree not to misuse the Site or Services or upload any Content that is unlawful, offensive or promotes violence or illegal activity in any way.</p>
                <h1 className='terms-and-privacy-subheader'>Service Availability</h1>
                <p>We make reasonable efforts to have the Site and related services available 24/7 without interruption. However, we cannot guarantee 100% uptime. The Site may be unavailable due to regular maintenance, updates or outages that are beyond our control. We are not liable to refund subscription fees or damages caused by downtime lasting less than 48 continuous hours. We will make reasonable efforts to restore access as soon as possible.</p>
                <h1 className='terms-and-privacy-subheader'>Privacy Policy</h1>
                <p>Figmafolio.com ("Figmafolio" or "we") respects the privacy of its users ("user" or "you"). This Privacy Policy explains how we collect, use, disclose, and protect your personal information. By visiting our website or using our services, you agree that your personal information will be handled as described in this Privacy Policy.</p>
                <h1 className='terms-and-privacy-subheader'>Collection of Personal Information</h1>
                <p>We collect information you voluntarily provide to us, such as when you register for an account or use certain services. Information we collect may include:</p>
                <ul>
                    <li>Contact details such as email address, phone number, and address</li>
                    <li>Account login credentials such as username and password</li>
                    <li>User profile information such as name, photo, and biography</li>
                    <li>Content you upload or share on Figmafolio such as design portfolios</li>
                </ul>
                <p>We also automatically track and collect the following anonymous information when you use our services:</p>
                <ul>
                    <li>Browser and device information</li>
                    <li>Server log information such as IP address, access dates, and times</li>
                    <li>Information collected by cookies or similar tracking technologies</li>
                </ul>
                <h1 className='terms-and-privacy-subheader'>Use of Personal Information</h1>
                <p>We use your personal information for the following purposes:</p>
                <ul>
                    <li>Provide our services</li>
                    <li>Communicate with you about our services</li>
                    <li>Customize content and improve our services</li>
                    <li>Detect and prevent fraud, spam, or abuse of our services</li>
                    <li>Comply with legal obligations</li>
                </ul>
                <p>We only share your personal information with third parties for the purposes of providing our services (ex: cloud storage providers) or if required by law. We do not sell or rent your personal information.</p>
                <h1 className='terms-and-privacy-subheader'>Data Retention</h1>
                <p>We retain your personal information for as long as reasonably necessary to provide you the services. We may also retain aggregated, anonymized data for analytics purposes.</p>
                <h1 className='terms-and-privacy-subheader'>Data Protection</h1>
                <p>We take reasonable administrative, technical and physical measures to safeguard your personal information against loss, theft and unauthorized access or disclosure. However, no internet transmission of information can be guaranteed 100% secure. We are not liable for any loss or unauthorized access beyond our control.</p>
                <h1 className='terms-and-privacy-subheader'>Privacy Rights & Choices</h1>
                <p>You may access, update or correct inaccuracies in your personal data by logging into your account and updating your account information or by submitting a request to us. You may also opt-out of receiving non-essential electronic communications by clicking the unsubscribe link.</p>
                <h1 className='terms-and-privacy-subheader'>Changes to this Policy</h1>
                <p>We may change this privacy policy at any time. We encourage you to periodically review this page for the latest information on our privacy practices.</p>
                <h1 className='terms-and-privacy-subheader'>Contact Us</h1>
                <p>If you have any questions about this Privacy Policy or use of your personal information, please contact us at: support[at]figmafolio.com. Let me know if you would like me to modify or expand any section of the privacy policy.</p>

            </div>
        </>)
}