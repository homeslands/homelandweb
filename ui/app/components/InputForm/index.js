/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * InputForm
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input } from 'reactstrap';
import ClassNames from 'classnames';
import './style.scss';

function InputForm(props) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={ClassNames('input-form-wrapper', props.className)}>
      <FormGroup>
        {props.label && (
          <Label for={props.name} className="label-input">
            {props.label}:
          </Label>
        )}
        <div
          className={ClassNames(
            'input-form',
            { 'add-icon': props.icon },
            { 'no-edit': props.edit },
          )}
        >
          {props.icon && (
            <div className="icon-append">
              <i className={props.icon} />
            </div>
          )}
          {props.type === 'password' && props.value && props.value.length > 0 && (
            <div
              className="icon-eye"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {!showPassword ? (
                <i className="fa fa-eye" />
              ) : (
                <i className="fa fa-eye-slash" />
              )}
            </div>
          )}
          <Input
            type={!showPassword ? props.type : 'text'}
            name={props.name}
            id={props.name}
            placeholder={props.placeholder}
            invalid={!!(props.touched && props.error)}
            min={props.min}
            max={props.max}
            onChange={props.onChange}
            onBlur={props.onBlur}
            value={props.value}
            onClick={props.onClick}
            onKeyDown={props.onKeyDown}
            disabled={props.disabled}
            readOnly={props.readOnly}
            autoComplete={props.autoComplete}
            accept={props.accept}
            multiple={props.multiple}
          />
        </div>
        {props.error && props.touched && (
          <span className="error">
            <i className="fa fa-exclamation-triangle" /> {props.error}
          </span>
        )}
      </FormGroup>
    </div>
  );
}

InputForm.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  icon: PropTypes.string,
  edit: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  touched: PropTypes.object,
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  autoComplete: PropTypes.string,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
};

export default InputForm;
