import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChartNoAxesCombined,
  CloudCog,
  Droplets,
  Gauge,
  HeartPulse,
  LoaderCircle,
  RotateCcw,
  Server,
  ShieldCheck,
  Sparkles,
  User,
  Wine,
} from 'lucide-react';

const referenceImage = '/first-page.png';

const features = [
  { label: 'XGBoost', detail: 'Classifier', icon: BrainCircuit, tone: 'pink' },
  { label: 'Validation', detail: 'AUC: 0.802', icon: ChartNoAxesCombined, tone: 'violet' },
  { label: 'SHAP', detail: 'Explainability', icon: ShieldCheck, tone: 'blue' },
  { label: 'FastAPI', detail: 'Backend', icon: CloudCog, tone: 'blue' },
];

const assessmentSections = [
  {
    title: 'Demographics',
    icon: User,
    fields: [
      { label: 'Age', name: 'age', type: 'number', placeholder: '52', unit: 'years' },
      { label: 'Gender', name: 'gender', type: 'select', options: ['Female', 'Male'] },
      { label: 'Height', name: 'height', type: 'number', placeholder: '168', unit: 'cm' },
      { label: 'Weight', name: 'weight', type: 'number', placeholder: '72', unit: 'kg' },
    ],
  },
  {
    title: 'Clinical Measurements',
    icon: Gauge,
    fields: [
      { label: 'Systolic Blood Pressure', name: 'ap_hi', type: 'number', placeholder: '120', unit: 'mmHg' },
      { label: 'Diastolic Blood Pressure', name: 'ap_lo', type: 'number', placeholder: '80', unit: 'mmHg' },
      { label: 'Cholesterol', name: 'cholesterol', type: 'select', options: ['Normal', 'Above Normal', 'Well Above Normal'] },
      { label: 'Glucose', name: 'gluc', type: 'select', options: ['Normal', 'Above Normal', 'Well Above Normal'] },
    ],
  },
];

const lifestyleFields = [
  { label: 'Smoking', name: 'smoke', icon: Droplets },
  { label: 'Alcohol Consumption', name: 'alco', icon: Wine },
  { label: 'Physical Activity', name: 'active', icon: Activity },
];

const loadingSteps = [
  'Feature Processing',
  'XGBoost Inference',
  'Computing SHAP Explanations',
];

const fieldRanges = {
  age: { min: 18, max: 120, label: 'Age' },
  height: { min: 50, max: 250, label: 'Height' },
  weight: { min: 10, max: 300, label: 'Weight' },
  ap_hi: { min: 50, max: 300, label: 'Systolic blood pressure' },
  ap_lo: { min: 30, max: 200, label: 'Diastolic blood pressure' },
};

const selectValueMaps = {
  gender: { Female: 1, Male: 2 },
  cholesterol: { Normal: 1, 'Above Normal': 2, 'Well Above Normal': 3 },
  gluc: { Normal: 1, 'Above Normal': 2, 'Well Above Normal': 3 },
};

const requiredSelectLabels = {
  gender: 'Gender',
  cholesterol: 'Cholesterol',
  gluc: 'Glucose',
};

const featureMeta = {
  age: { label: 'Age', icon: User },
  gender: { label: 'Gender', icon: User },
  height: { label: 'Height', icon: Activity },
  weight: { label: 'Weight', icon: Activity },
  ap_hi: { label: 'Blood Pressure', icon: Gauge },
  ap_lo: { label: 'Diastolic Pressure', icon: Gauge },
  cholesterol: { label: 'Cholesterol', icon: Droplets },
  gluc: { label: 'Glucose', icon: Droplets },
  smoke: { label: 'Smoking', icon: Droplets },
  alco: { label: 'Alcohol Consumption', icon: Wine },
  active: { label: 'Physical Activity', icon: Activity },
};

const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

function parseRequiredNumber(formData, name, errors) {
  const rawValue = String(formData.get(name) ?? '').trim();
  const range = fieldRanges[name];

  if (!rawValue) {
    errors[name] = `${range.label} is required.`;
    return null;
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    errors[name] = `${range.label} must be a valid number.`;
    return null;
  }

  if (value < range.min || value > range.max) {
    errors[name] = `${range.label} must be between ${range.min} and ${range.max}.`;
    return null;
  }

  return value;
}

function parseRequiredSelect(formData, name, errors) {
  const rawValue = String(formData.get(name) ?? '');
  const mappedValue = selectValueMaps[name][rawValue];

  if (!mappedValue) {
    errors[name] = `${requiredSelectLabels[name]} is required.`;
    return null;
  }

  return mappedValue;
}

function createPayload(formData) {
  const errors = {};
  const payload = {
    age: parseRequiredNumber(formData, 'age', errors),
    gender: parseRequiredSelect(formData, 'gender', errors),
    height: parseRequiredNumber(formData, 'height', errors),
    weight: parseRequiredNumber(formData, 'weight', errors),
    ap_hi: parseRequiredNumber(formData, 'ap_hi', errors),
    ap_lo: parseRequiredNumber(formData, 'ap_lo', errors),
    cholesterol: parseRequiredSelect(formData, 'cholesterol', errors),
    gluc: parseRequiredSelect(formData, 'gluc', errors),
    smoke: formData.get('smoke') === 'on' ? 1 : 0,
    alco: formData.get('alco') === 'on' ? 1 : 0,
    active: formData.get('active') === 'on' ? 1 : 0,
  };

  if (
    payload.ap_hi !== null &&
    payload.ap_lo !== null &&
    payload.ap_hi <= payload.ap_lo
  ) {
    errors.ap_hi = 'Systolic blood pressure must be greater than diastolic blood pressure.';
    errors.ap_lo = 'Diastolic blood pressure must be lower than systolic blood pressure.';
  }

  if (Object.keys(errors).length > 0) {
    return { payload: null, errors };
  }

  return { payload, errors };
}

function validatePredictionResponse(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      typeof value.risk_probability === 'number' &&
      typeof value.prediction === 'string' &&
      typeof value.threshold === 'number' &&
      value.shap_contributions &&
      typeof value.shap_contributions === 'object' &&
      Array.isArray(value.top_factors),
  );
}

function getFeatureLabel(featureName) {
  return featureMeta[featureName]?.label ?? featureName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getFeatureIcon(featureName) {
  return featureMeta[featureName]?.icon ?? BarChart3;
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function BrandMark({ size = 'large' }) {
  const isLarge = size === 'large';

  return (
    <div className="flex items-center gap-6 sm:gap-7">
      <HeartPulse
        className={isLarge ? 'h-14 w-14 sm:h-[58px] sm:w-[58px]' : 'h-9 w-9'}
        strokeWidth={2.25}
      />
      <span
        className={
          isLarge
            ? 'brand-text text-2xl sm:text-[2rem]'
            : 'brand-text text-xl'
        }
      >
        ENSEMBLE
      </span>
    </div>
  );
}

function FeatureCard({ feature, index }) {
  const Icon = feature.icon;

  return (
    <motion.div
      className={`feature-card feature-card-${feature.tone}`}
      variants={fadeUp}
      transition={{ duration: 0.55, delay: 0.4 + index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -7, boxShadow: '0 0 34px rgba(255, 45, 112, 0.18)' }}
    >
      <Icon className="mb-4 h-[46px] w-[46px]" strokeWidth={1.85} />
      <p className="text-[1.22rem] font-semibold leading-tight text-white">{feature.label}</p>
      <p className="mt-2 text-[1.12rem] leading-tight text-white/90">
        {feature.detail.includes('0.802') ? (
          <>
            AUC: <span className="font-semibold text-neon">0.802</span>
          </>
        ) : (
          feature.detail
        )}
      </p>
    </motion.div>
  );
}

function HeartVisual() {
  return (
    <motion.div
      className="heart-stage"
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.9, delay: 0.22, ease: 'easeOut' }}
    >
      <div className="heart-glow" />
      <div className="ecg-line" />
      <motion.div
        className="heart-crop"
        animate={{ y: [0, -16, 0], rotate: [0, 0.7, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img src={referenceImage} alt="Glowing anatomical heart visualization" />
      </motion.div>
    </motion.div>
  );
}

function PageChrome({ children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-night text-white">
      <div className="cosmic-grid" />
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <div className="star-field" />
      {children}
    </main>
  );
}

function FieldControl({ field, error, isDisabled }) {
  const fieldId = `field-${field.name}`;
  const errorId = `${fieldId}-error`;

  if (field.type === 'select') {
    return (
      <label className={`field-shell ${error ? 'field-shell-error' : ''}`} htmlFor={fieldId}>
        <span>{field.label}</span>
        <select
          id={fieldId}
          name={field.name}
          defaultValue=""
          required
          disabled={isDisabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        >
          <option value="" disabled>
            Select
          </option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error ? <strong id={errorId}>{error}</strong> : null}
      </label>
    );
  }

  const range = fieldRanges[field.name];

  return (
    <label className={`field-shell ${error ? 'field-shell-error' : ''}`} htmlFor={fieldId}>
      <span>{field.label}</span>
      <div className="input-with-unit">
        <input
          id={fieldId}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          min={range?.min}
          max={range?.max}
          step="1"
          inputMode="numeric"
          required
          disabled={isDisabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        <em>{field.unit}</em>
      </div>
      {error ? <strong id={errorId}>{error}</strong> : null}
    </label>
  );
}

function AssessmentSection({ section, index, errors, isDisabled }) {
  const Icon = section.icon;

  return (
    <motion.section
      className="assessment-card"
      variants={fadeUp}
      transition={{ duration: 0.55, delay: 0.15 + index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
    >
      <header>
        <Icon />
        <h2>{section.title}</h2>
      </header>
      <div className="assessment-grid">
        {section.fields.map((field) => (
          <FieldControl
            key={field.name}
            field={field}
            error={errors[field.name]}
            isDisabled={isDisabled}
          />
        ))}
      </div>
    </motion.section>
  );
}

function LifestyleToggle({ field, isDisabled }) {
  const Icon = field.icon;

  return (
    <label className="toggle-card">
      <input type="checkbox" name={field.name} disabled={isDisabled} />
      <span className="toggle-icon">
        <Icon />
      </span>
      <span className="toggle-label">{field.label}</span>
      <span className="toggle-switch" aria-hidden="true" />
    </label>
  );
}

function RiskGauge({ probability }) {
  const radius = 92;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      className="risk-gauge-card"
      variants={fadeUp}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
    >
      <div className="risk-gauge">
        <svg viewBox="0 0 240 240" role="img" aria-label={`Predicted risk probability ${formatPercent(probability)}`}>
          <circle className="risk-gauge-track" cx="120" cy="120" r={radius} />
          <motion.circle
            className="risk-gauge-progress"
            cx="120"
            cy="120"
            r={radius}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - probability) }}
            transition={{ duration: 1.25, ease: 'easeOut' }}
          />
        </svg>
        <motion.div
          className="risk-gauge-value"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.35, ease: 'easeOut' }}
        >
          <strong>{formatPercent(probability)}</strong>
          <span>Predicted Risk Probability</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ClassificationCard({ prediction, threshold }) {
  const isHighRisk = prediction === 'high_risk';

  return (
    <motion.section
      className={`classification-card ${isHighRisk ? 'classification-high' : 'classification-low'}`}
      variants={fadeUp}
      transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
    >
      <div className="classification-icon">
        {isHighRisk ? <AlertTriangle /> : <CheckCircle2 />}
      </div>
      <p>Classification</p>
      <h2>{isHighRisk ? 'HIGH RISK' : 'LOW RISK'}</h2>
      <span>Decision Threshold: {formatPercent(threshold)}</span>
    </motion.section>
  );
}

function KeyContributors({ factors }) {
  return (
    <motion.section
      className="results-card key-contributors-card"
      variants={fadeUp}
      transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
    >
      <header>
        <Sparkles />
        <div>
          <h2>Key Contributors</h2>
          <p>Top model drivers returned by the prediction API.</p>
        </div>
      </header>
      <div className="contributor-grid">
        {factors.map((factor, index) => {
          const Icon = getFeatureIcon(factor);

          return (
            <motion.div
              className="contributor-card"
              key={`${factor}-${index}`}
              variants={fadeUp}
              transition={{ duration: 0.45, delay: 0.2 + index * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <span>{index + 1}</span>
              <Icon />
              <strong>{getFeatureLabel(factor)}</strong>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

function ShapChart({ contributions }) {
  const sortedContributions = Object.entries(contributions ?? {})
    .filter(([, value]) => typeof value === 'number' && Number.isFinite(value))
    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a));
  const maxAbsValue = Math.max(...sortedContributions.map(([, value]) => Math.abs(value)), 0.01);

  return (
    <motion.section
      className="results-card shap-card"
      variants={fadeUp}
      transition={{ duration: 0.55, delay: 0.22, ease: 'easeOut' }}
    >
      <header>
        <BarChart3 />
        <div>
          <h2>Why Did The Model Predict This?</h2>
          <p>
            SHAP values indicate how each feature influenced the model's internal score.
            Positive values push the prediction toward higher risk, while negative values push
            it toward lower risk. Bar lengths are scaled for visual comparison.
          </p>
        </div>
      </header>

      <div className="shap-chart" role="list">
        {sortedContributions.map(([featureName, value], index) => {
          const isPositive = value >= 0;
          const normalizedWidth = Math.abs(value) / maxAbsValue;
          const width = `${Math.max(normalizedWidth * 48, 4)}%`;

          return (
            <motion.div
              className="shap-row"
              key={featureName}
              role="listitem"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 * index }}
            >
              <span className="shap-feature">{getFeatureLabel(featureName)}</span>
              <div className="shap-axis">
                <motion.span
                  className={`shap-bar ${isPositive ? 'shap-positive' : 'shap-negative'}`}
                  initial={{ width: 0 }}
                  animate={{ width }}
                  transition={{ duration: 0.8, delay: 0.15 + index * 0.05, ease: 'easeOut' }}
                />
              </div>
              <span className={isPositive ? 'shap-value-positive' : 'shap-value-negative'}>
                {value >= 0 ? '+' : ''}
                {value.toFixed(4)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

function TechnicalDetails() {
  const details = [
    ['Algorithm', 'XGBoost'],
    ['Validation AUC', '0.802'],
    ['Features Used', '11'],
    ['Inference API', 'FastAPI'],
    ['Explainability', 'SHAP'],
  ];

  return (
    <motion.section
      className="results-card technical-card"
      variants={fadeUp}
      transition={{ duration: 0.55, delay: 0.28, ease: 'easeOut' }}
    >
      <header>
        <Server />
        <div>
          <h2>Model Information</h2>
          <p>Technical context behind this prediction.</p>
        </div>
      </header>
      <dl>
        {details.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </motion.section>
  );
}

function ModelLimitationsCard() {
  return (
    <motion.section
      className="results-card model-limitations-card"
      variants={fadeUp}
      transition={{ duration: 0.55, delay: 0.36, ease: 'easeOut' }}
    >
      <header>
        <AlertCircle />
        <div>
          <h2>Model Limitations</h2>
        </div>
      </header>
      <p>
        This model was trained on patient records with ages ranging from 30 to 65 years.
        Predictions for patients outside this range may be less reliable because the model
        has not observed many similar examples during training.
      </p>
      <p>
        This application is intended for educational and demonstration purposes only and
        should not be used for medical decision-making.
      </p>
    </motion.section>
  );
}

function ResultsPage({ result, onNewAssessment }) {
  return (
    <PageChrome>
      <section className="results-shell relative z-10 px-6 py-8 sm:px-10 lg:px-[5.2vw]">
        <motion.header
          className="results-header"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div variants={fadeUp}>
            <BrandMark />
          </motion.div>
          <motion.div className="results-title-block" variants={fadeUp}>
            <p>RISK ASSESSMENT COMPLETE</p>
            <h1>Your Cardiovascular Risk Analysis</h1>
            <span>Generated using the deployed XGBoost prediction model.</span>
          </motion.div>
          <motion.div className="results-meta-row" variants={fadeUp}>
            <span>Model Version: {result.model_version}</span>
            <span>Validation AUC: 0.802</span>
            <span>Explainable AI Enabled</span>
          </motion.div>
        </motion.header>

        <motion.div
          className="results-layout"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <RiskGauge probability={result.risk_probability} />
          <ClassificationCard prediction={result.prediction} threshold={result.threshold} />
          <KeyContributors factors={result.top_factors} />
          <ShapChart contributions={result.shap_contributions} />
          <TechnicalDetails />
          <motion.section
            className="results-card disclaimer-card"
            variants={fadeUp}
            transition={{ duration: 0.55, delay: 0.34, ease: 'easeOut' }}
          >
            <AlertCircle />
            <p>
              This prediction is generated by a machine learning model trained on historical
              cardiovascular disease data and is intended for educational and demonstration
              purposes only. It is not medical advice.
            </p>
          </motion.section>
          <ModelLimitationsCard />
          <motion.div className="results-actions" variants={fadeUp}>
            <button type="button" className="cta-button results-new-button" onClick={onNewAssessment}>
              <RotateCcw />
              <span>New Assessment</span>
              <ArrowRight />
            </button>
          </motion.div>
        </motion.div>
      </section>
    </PageChrome>
  );
}

function AssessmentPage({ onBack, onPredictionSuccess }) {
  const [fieldErrors, setFieldErrors] = useState({});
  const [formMessage, setFormMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const { payload, errors } = createPayload(formData);

    setFieldErrors(errors);
    setSuccessMessage('');

    if (!payload) {
      setFormMessage('Please fix the highlighted inputs before generating an assessment.');
      const firstInvalidName = Object.keys(errors)[0];
      form.elements[firstInvalidName]?.focus();
      return;
    }

    const apiBaseUrl = import.meta.env.VITE_API_URL;

    if (!apiBaseUrl) {
      setFormMessage('Prediction API is not configured. Set VITE_API_URL before submitting.');
      return;
    }

    setFormMessage('');
    setIsSubmitting(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 65000);

    try {
      const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Prediction request failed with status ${response.status}.`);
      }

      const data = await response.json();

      if (!validatePredictionResponse(data)) {
        throw new Error('Prediction API returned an unexpected response.');
      }

      setSuccessMessage('');
      onPredictionSuccess(data);
    } catch (error) {
      if (error.name === 'AbortError') {
        setFormMessage('Prediction request timed out. Please try again.');
      } else {
        setFormMessage('Unable to generate an assessment right now. Check the API connection and try again.');
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  return (
    <PageChrome>
      <section className="assessment-shell relative z-10 px-6 py-8 sm:px-10 lg:px-[5.2vw]">
        <motion.header
          className="assessment-header"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.button
            type="button"
            className="back-button"
            onClick={onBack}
            variants={fadeUp}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowRight />
            <span>Back</span>
          </motion.button>
          <motion.div variants={fadeUp}>
            <BrandMark />
          </motion.div>
          <motion.div className="assessment-title-block" variants={fadeUp}>
            <p>Risk Assessment</p>
            <h1>Enter Patient Metrics</h1>
            <span>
              Provide the model inputs used by the deployed cardiovascular risk pipeline.
            </span>
          </motion.div>
        </motion.header>

        <motion.form
          className="assessment-form"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          onSubmit={handleSubmit}
          noValidate
        >
          {assessmentSections.map((section, index) => (
            <AssessmentSection
              key={section.title}
              section={section}
              index={index}
              errors={fieldErrors}
              isDisabled={isSubmitting}
            />
          ))}

          <motion.section
            className="assessment-card lifestyle-card"
            variants={fadeUp}
            transition={{ duration: 0.55, delay: 0.32, ease: 'easeOut' }}
          >
            <header>
              <Activity />
              <h2>Lifestyle Factors</h2>
            </header>
            <div className="lifestyle-grid">
              {lifestyleFields.map((field) => (
                <LifestyleToggle key={field.name} field={field} isDisabled={isSubmitting} />
              ))}
            </div>
          </motion.section>

          <div className="form-status-region" aria-live="polite" aria-atomic="true">
            {isSubmitting ? (
              <motion.div
                className="loading-workflow"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {loadingSteps.map((step, index) => (
                  <motion.span
                    key={step}
                    initial={{ opacity: 0.45 }}
                    animate={{ opacity: index < 2 ? 1 : [0.55, 1, 0.55] }}
                    transition={{
                      duration: index < 2 ? 0.25 : 1.1,
                      repeat: index < 2 ? 0 : Infinity,
                      delay: index * 0.12,
                    }}
                  >
                    {index < 2 ? '✓' : '⟳'} {step}
                  </motion.span>
                ))}
              </motion.div>
            ) : null}
            {formMessage ? (
              <p className="form-message form-message-error">
                <AlertCircle />
                <span>{formMessage}</span>
              </p>
            ) : null}
            {successMessage ? (
              <p className="form-message form-message-success">
                <HeartPulse />
                <span>{successMessage}</span>
              </p>
            ) : null}
          </div>

          <motion.div className="assessment-actions" variants={fadeUp}>
            <button type="submit" className="cta-button assessment-submit" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="spin-icon" /> : <HeartPulse />}
              <span>{isSubmitting ? 'Analyzing Clinical Features...' : 'Generate Risk Assessment'}</span>
              <ArrowRight />
            </button>
          </motion.div>
        </motion.form>
      </section>
      {isSubmitting ? (
        <motion.div
          className="prediction-loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          role="status"
          aria-live="assertive"
          aria-label="Generating Risk Assessment"
        >
          <div className="prediction-loading-card">
            <LoaderCircle className="prediction-loading-spinner" />
            <h2>Generating Risk Assessment</h2>
            <p>Running XGBoost inference and generating SHAP explanations...</p>
            <span>
              First request may take up to 60 seconds if the model server is waking from sleep.
            </span>
          </div>
        </motion.div>
      ) : null}
    </PageChrome>
  );
}

function LandingPage() {
  return (
    <PageChrome>
      <section className="landing-shell relative z-10 grid min-h-screen grid-cols-1 items-center px-6 py-10 sm:px-10 lg:grid-cols-[minmax(820px,1fr)_minmax(460px,0.9fr)] lg:px-[5.2vw] xl:px-[5.15vw]">
        <motion.div
          className="hero-copy max-w-[860px] pt-4 lg:pt-0"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.65, ease: 'easeOut' }}>
            <BrandMark />
          </motion.div>

          <motion.h1
            className="hero-title mt-28 max-w-[900px] text-[clamp(3.35rem,4.15vw,4.3rem)] font-extrabold leading-[1.08] tracking-normal text-white drop-shadow-[0_0_22px_rgba(255,255,255,0.12)] lg:mt-[8.5rem]"
            variants={fadeUp}
            transition={{ duration: 0.68, delay: 0.12, ease: 'easeOut' }}
          >
            From Clinical Data to
            <span className="mt-3 block bg-gradient-to-r from-[#ff5a92] via-[#f27ba4] to-[#ff899c] bg-clip-text text-transparent">
              Actionable Risk Insights
            </span>
          </motion.h1>

          <motion.p
            className="hero-description mt-9 max-w-[710px] text-[clamp(1.18rem,1.78vw,2.04rem)] leading-[1.46] text-white/83"
            variants={fadeUp}
            transition={{ duration: 0.65, delay: 0.22, ease: 'easeOut' }}
          >
            Ensemble uses a gradient-boosted machine learning model trained on{' '}
            <span className="font-medium text-neon">68,676</span> patient records to estimate
            cardiovascular disease risk.
          </motion.p>

          <motion.div
            className="feature-grid mt-11 grid max-w-[800px] grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-4 lg:gap-[0.88rem]"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={feature.label} feature={feature} index={index} />
            ))}
          </motion.div>

          <motion.a
            href="#assessment"
            className="cta-button mt-11 inline-flex h-[108px] w-full max-w-[470px] items-center justify-between rounded-[28px] px-10 text-[clamp(1.45rem,2vw,2.12rem)] font-bold"
            variants={fadeUp}
            transition={{ duration: 0.65, delay: 0.56, ease: 'easeOut' }}
            whileHover={{ y: -4, scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            aria-label="Try the Model"
          >
            <HeartPulse className="h-14 w-14 shrink-0" strokeWidth={2.2} />
            <span>Try the Model</span>
            <ArrowRight className="h-12 w-12 shrink-0" strokeWidth={2.2} />
          </motion.a>
        </motion.div>

        <HeartVisual />
      </section>
    </PageChrome>
  );
}

export default function App() {
  const [page, setPage] = useState(() => (window.location.hash === '#assessment' ? 'assessment' : 'landing'));
  const [predictionResult, setPredictionResult] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#assessment') {
        setPage('assessment');
      } else if (window.location.hash === '#results' && predictionResult) {
        setPage('results');
      } else if (window.location.hash === '#results') {
        setPage('assessment');
      } else {
        setPage('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [predictionResult]);

  if (page === 'results' && predictionResult) {
    return (
      <ResultsPage
        result={predictionResult}
        onNewAssessment={() => {
          setPredictionResult(null);
          window.history.pushState(null, '', '#assessment');
          setPage('assessment');
        }}
      />
    );
  }

  if (page === 'assessment') {
    return (
      <AssessmentPage
        onBack={() => {
          window.history.pushState(null, '', window.location.pathname);
          setPage('landing');
        }}
        onPredictionSuccess={(result) => {
          setPredictionResult(result);
          window.history.pushState(null, '', '#results');
          setPage('results');
        }}
      />
    );
  }

  return <LandingPage />;
}
