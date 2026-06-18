# CODEX.md

first-page.png is the visual source of truth for the landing page.

## Project Overview

Project Name: Ensemble

Ensemble is an end-to-end machine learning application that predicts cardiovascular disease risk from patient health metrics.

The backend is already completed and deployed separately. This repository contains only the frontend application.

The purpose of this frontend is twofold:

1. Demonstrate a deployed machine learning system.
2. Allow users and recruiters to interact with the model through a polished web interface.

This is NOT a healthcare startup website.

This is NOT a marketing site.

This is a portfolio project showcasing machine learning engineering, model deployment, explainability, and frontend integration.

---

## Technology Stack

Required:

* React (Vite)
* Tailwind CSS
* Framer Motion
* Lucide React Icons

Do not introduce additional UI frameworks.

Do not use Material UI.

Do not use Bootstrap.

Do not use Chakra UI.

Use clean custom Tailwind components.

---

## Design Philosophy

The frontend should feel:

* Modern
* Premium
* Technical
* Futuristic
* Recruiter-focused

Visual references:

* Vercel
* Linear
* Stripe
* Arc Browser

Avoid:

* Generic hospital websites
* Medical stock-photo layouts
* Corporate healthcare templates
* Excessive blue-and-white clinical designs

---

## Color Theme

Primary Background:
Deep navy / near-black

Accent Colors:

* Neon pink
* Purple
* Soft magenta

Visual Style:

* Glassmorphism cards
* Glow effects
* Subtle gradients
* Soft shadows
* Smooth animations

The design should resemble a modern AI platform rather than a hospital portal.

---

## Layout Structure

The application contains two major views:

1. Landing Page
2. Assessment Page

---

# LANDING PAGE

Purpose:

Immediately communicate:

* What the project does
* How the ML system works
* Why it is technically interesting
* Allow users to test the model

---

## Hero Section

Two-column layout.

Left Side:

Title:

ENSEMBLE

Headline:

From Clinical Data to
Actionable Risk Insights

Description:

Ensemble uses a gradient-boosted machine learning model trained on 68,676 patient records to estimate cardiovascular disease risk.

Feature List:

* XGBoost Classifier
* Validation AUC: 0.802
* SHAP Explainability
* FastAPI Backend
* Real-Time Prediction

Primary CTA:

Try the Model

The button should navigate to the Assessment Page.

---

Right Side:

Display the supplied glowing heart artwork.

The image is the visual centerpiece of the page.

Apply:

* Floating animation
* Soft glow effects
* Subtle motion

Do not replace the image with icons or illustrations.

---

## How It Works Section

Display four connected cards.

Card 1:
Patient Metrics

Description:
Patient demographics, blood pressure, cholesterol, glucose, and lifestyle factors.

Card 2:
Feature Processing

Description:
Numerical features are scaled using the same preprocessing pipeline used during model training.

Card 3:
XGBoost Prediction

Description:
A trained gradient-boosted tree ensemble estimates cardiovascular disease risk.

Card 4:
Explainable Results

Description:
SHAP values identify the strongest factors influencing each prediction.

Use animations while scrolling.

---

## Project Metrics Section

Display prominent metric cards.

Metric 1:
68,676
Patient Records

Metric 2:
0.802
Validation AUC

Metric 3:
11
Clinical Features

Metric 4:
FastAPI
Inference API

These should appear visually impressive and recruiter-friendly.

---

## CTA Section

Headline:

Ready to Test the Model?

Description:

Generate a cardiovascular risk assessment using the deployed machine learning model.

Button:

Start Assessment

---

# ASSESSMENT PAGE

Purpose:

Allow the user to submit health metrics and receive a prediction from the deployed backend.

---

## Form Sections

### Demographics

Fields:

* Age
* Gender
* Height
* Weight

---

### Clinical Measurements

Fields:

* Systolic Blood Pressure
* Diastolic Blood Pressure
* Cholesterol
* Glucose

---

### Lifestyle Factors

Fields:

* Smoker
* Alcohol Consumption
* Physically Active

Use modern toggle switches when possible.

Avoid plain HTML checkboxes.

---

## Submit Button

Text:

Generate Risk Assessment

---

# API INTEGRATION

Backend already exists.

Prediction endpoint:

POST /predict

Request payload:

{
"age": number,
"gender": number,
"height": number,
"weight": number,
"ap_hi": number,
"ap_lo": number,
"cholesterol": number,
"gluc": number,
"smoke": number,
"alco": number,
"active": number
}

Response:

{
"model_version": "v1",
"risk_probability": 0.5353,
"prediction": "high_risk",
"threshold": 0.4,
"shap_contributions": {},
"shap_note": "",
"top_factors": []
}

API base URL must be loaded from:

VITE_API_URL

Never hardcode URLs.

---

# RESULTS PAGE

Display prediction results after successful API response.

---

## Risk Score Card

Prominently display:

Risk Probability

Example:

53.5%

Use:

* Progress ring
* Animated reveal
* Glow effect

---

## Risk Classification

Display:

* High Risk
  or
* Low Risk

Use visual badges.

---

## Key Contributors

Display top_factors returned by the API.

Example:

Key Contributors

1. Blood Pressure
2. Age
3. Cholesterol

---

## SHAP Visualization

Display horizontal bars.

Positive values:
Increase risk

Negative values:
Decrease risk

Provide a professional visualization.

---

# Animation Requirements

Use Framer Motion.

Include:

* Fade-in sections
* Scroll reveal animations
* Floating hero image
* Hover interactions
* Smooth transitions

Animations should feel premium but not distracting.

---

# Responsiveness

Must work on:

* Desktop
* Tablet
* Mobile

Desktop experience is the highest priority.

---

# Code Quality

Requirements:

* Reusable components
* Clean folder structure
* No unnecessary abstractions
* Readable code
* Proper comments only where useful

Do not overengineer.

---

# Success Criteria

A recruiter should immediately understand:

1. A machine learning model was built.
2. The model was evaluated properly.
3. The model is deployed.
4. The user can interact with it.
5. The project demonstrates full-stack ML engineering skills.

Every design decision should support those goals.
