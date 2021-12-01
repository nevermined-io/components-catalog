import React from 'react';
import { FormInformation } from '../../types';
import cx from 'classnames';
import defaultStyles from './scss/RegistrationStep.module.scss';
import FormField from './FormField';
import { BEM, extendClassName } from '../../utils/bemHelpers';

interface RegistrationStepProps {
  title: string | React.ReactNode;
  className?: string;
  styles?: {
    root?: any;
    form?: any;
    formElement?: any;
    registrationStep?: any;
  };
  fields: Array<FormInformation>;
  children?: React.ReactNode;
}

const RegistrationStep = ({
  title = 'Registration Step',
  styles = defaultStyles,
  className = 'registration-step',
  fields = [
    {
      label: 'Author',
      id: 'author',
      type: 'text'
    }
  ],
  children
}: RegistrationStepProps) => {
  const b = BEM(className);
  return (
    <section className={className}>
      {typeof title === 'string' ? <h2>{title}</h2> : title}
      <form className={b('form')}>
        <ul className={b('form-list')}>
          {fields.map(({ id, label, type, rows, cols, min, max, step }: FormInformation) => {
            const fieldClassName = b('formfield');
            return (
              <FormField
                key={id}
                className={fieldClassName}
                label={label}
                rows={rows}
                cols={cols}
                id={id}
                min={min}
                max={max}
                step={step}
                type={type}
              />
            );
          })}
        </ul>
      </form>
      {children}
    </section>
  );
};

export default RegistrationStep;
