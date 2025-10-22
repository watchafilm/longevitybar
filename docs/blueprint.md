# **App Name**: SipSwift

## Core Features:

- Order Input: Front-of-house interface for staff to input drink orders: select drink, quantity, payment method (cash, QR scan, credit card QR).
- Order Confirmation: Confirms the order with the final amount and payment details before submission.
- Real-time Order Display: Back-of-house iPad interface to display incoming orders in real-time, sorted by order time (first ordered on top).
- Serve Status: Allows staff to mark orders as 'served', updating the status on all interfaces.
- Order Storage: Utilizes Firestore to store drink orders, order details, and status.
- Order History and Summary: Provides a record of past orders with a summary of total sales, accessible from the admin page.

## Style Guidelines:

- Primary color: Deep violet (#5853FF) to signify richness and an upscale feeling.
- Background color: Very light lavender (#F1F0FF).
- Accent color: Slightly muted magenta (#D351FF).
- Headline font: 'Space Grotesk' sans-serif for headlines and short amounts of body text; Body font: 'Inter' for longer text.
- Use minimalist and modern icons to represent menu items and actions.
- The front-of-house interface has an intuitive layout optimized for speed and accuracy, suitable for touch interactions.
- The back-of-house interface uses clear, real-time information and ordering by the time it was made.