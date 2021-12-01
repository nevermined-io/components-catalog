import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import defaultStyles from './scss/index.module.scss';
import { FormInformation } from '../../types';
import RegistrationStep from './RegistrationStep';

import uniqBy from 'lodash.uniqby';
// import MetaDataFormProvider, { MetaDataFormDTO } from '../../contexts/form/MetaDataFormProvider';

interface AssetRegistrationProps {
  styles?: {
    root?: string;
    navigationButtonContainer?: string;
    registrationStep?: string;
  };
  debug?: boolean;
  onSubmit?: (data: any) => void;
  onSubmitError?: (error: any) => void;
  detailFields?: Array<FormInformation>;
  authorshipFields?: Array<FormInformation>;
  pricingFields?: Array<FormInformation>;
}

export default function AssetRegistration({
  debug = true,
  onSubmit = (data: any) => console.log('Should submit to API', data),
  onSubmitError = (error: any) => console.log('Error', error),
  styles = defaultStyles,
  detailFields = [],
  pricingFields = [],
  authorshipFields = []
}: AssetRegistrationProps) {
  const { watch, handleSubmit } = useFormContext();
  const [currentStep, setCurrentStep] = useState(0);

  // if (debug) console.log(watch());
  useEffect(() => {
    const subscription = watch((value, { name, type }) => console.log(value, name, type));
    return () => subscription.unsubscribe();
  }, [watch]);
  const onNextClick = () => setCurrentStep(currentStep + 1);
  const onPreviousClick = () => setCurrentStep(currentStep - 1);

  return (
    <section className={styles.root}>
      <h1>Asset Registration, Current Step: {currentStep}</h1>

      {currentStep === 0 && (
        <RegistrationStep
          title={<h2>Details</h2>}
          fields={uniqBy(
            [
              { id: 'name', label: 'Asset Name', type: 'text' },
              { id: 'description', label: 'Asset Description:', type: 'textarea' },
              { id: 'files', label: 'Asset Files:', type: 'file' },
              ...detailFields
            ],
            'id'
          )}
        />
      )}
      {currentStep === 1 && (
        <RegistrationStep
          // styles={styles.registrationStep}
          title={<h2>Authorship</h2>}
          fields={uniqBy(
            [{ id: 'author', label: 'Asset Author', type: 'text' }, ...authorshipFields],
            'id'
          )}
        />
      )}
      {currentStep === 2 && (
        <RegistrationStep
          title={<h2>Pricing</h2>}
          fields={uniqBy(
            [
              {
                id: 'price',
                label: 'Asset Price',
                type: 'number',
                min: 0,
                step: 1
              },
              ...pricingFields
            ],
            'id'
          )}
        />
      )}

      <section className={styles.navigationButtonContainer}>
        {currentStep !== 0 && (
          <button disabled={currentStep === 0} onClick={onPreviousClick} type="button">
            Previous
          </button>
        )}
        {currentStep < 2 && (
          <button disabled={currentStep === 2} onClick={onNextClick} type="button">
            Next
          </button>
        )}
        {currentStep === 2 && (
          <button onClick={handleSubmit(onSubmit, onSubmitError)} type="button">
            Submit
          </button>
        )}
      </section>
    </section>
  );
}
