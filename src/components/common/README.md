# Shared Components

## SharedSelect

A reusable select component that integrates React Select with React Hook Form's Controller.

### Features

- Integrates React Select with React Hook Form
- Handles validation and error display
- Customizable styles
- Support for required fields
- Accessible labels and error messages
- Additional onChange handler support

### Usage

```jsx
import { useForm } from "react-hook-form";
import SharedSelect from "./SharedSelect";

const MyForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SharedSelect
        name="mySelect"
        label="My Select"
        control={control}
        options={options}
        required={true}
        errors={errors}
      />

      <button type="submit">Submit</button>
    </form>
  );
};
```

### Props

| Prop        | Type     | Description                        | Required |
| ----------- | -------- | ---------------------------------- | -------- |
| name        | string   | Field name for the form controller | Yes      |
| control     | object   | React Hook Form control object     | Yes      |
| options     | array    | Array of options for the select    | Yes      |
| label       | string   | Label text for the select          | No       |
| required    | boolean  | Whether the field is required      | No       |
| placeholder | string   | Placeholder text                   | No       |
| isDisabled  | boolean  | Whether the select is disabled     | No       |
| rules       | object   | React Hook Form validation rules   | No       |
| onChange    | function | Additional onChange handler        | No       |
| styles      | object   | Custom styles for React Select     | No       |
| value       | any      | Current value                      | No       |
| errors      | object   | Form errors object                 | No       |
| className   | string   | Additional class name              | No       |

## SharedInput

A reusable input component that integrates with React Hook Form's Controller.

### Features

- Integrates with React Hook Form
- Handles validation and error display
- Supports multiple input types (text, number, email, password, etc.)
- Support for required fields
- Accessible labels and error messages
- Additional onChange handler support

### Usage

```jsx
import { useForm } from "react-hook-form";
import SharedInput from "./SharedInput";

const MyForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SharedInput
        name="fullName"
        label="Full Name"
        control={control}
        required={true}
        errors={errors}
        placeholder="Enter your full name"
      />

      <SharedInput
        name="email"
        label="Email Address"
        type="email"
        control={control}
        required={true}
        errors={errors}
        rules={{
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        }}
        placeholder="Enter your email address"
      />

      <button type="submit">Submit</button>
    </form>
  );
};
```

### Props

| Prop           | Type     | Description                                      | Required |
| -------------- | -------- | ------------------------------------------------ | -------- |
| name           | string   | Field name for the form controller               | Yes      |
| control        | object   | React Hook Form control object                   | Yes      |
| label          | string   | Label text for the input                         | No       |
| type           | string   | Input type (text, number, email, password, etc.) | No       |
| required       | boolean  | Whether the field is required                    | No       |
| placeholder    | string   | Placeholder text                                 | No       |
| disabled       | boolean  | Whether the input is disabled                    | No       |
| rules          | object   | React Hook Form validation rules                 | No       |
| onChange       | function | Additional onChange handler                      | No       |
| defaultValue   | any      | Default value for the input                      | No       |
| errors         | object   | Form errors object                               | No       |
| className      | string   | Additional class name for the container          | No       |
| inputClassName | string   | Additional class name for the input element      | No       |

## SharedTextArea

A reusable textarea component that integrates with React Hook Form's Controller.

### Features

- Integrates with React Hook Form
- Handles validation and error display
- Character counter with maxLength support
- Support for required fields
- Accessible labels and error messages
- Additional onChange handler support

### Usage

```jsx
import { useForm } from "react-hook-form";
import SharedTextArea from "./SharedTextArea";

const MyForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SharedTextArea
        name="description"
        label="Description"
        control={control}
        required={true}
        errors={errors}
        placeholder="Enter description"
        rows={6}
        maxLength={500}
      />

      <button type="submit">Submit</button>
    </form>
  );
};
```

### Props

| Prop              | Type     | Description                                    | Required |
| ----------------- | -------- | ---------------------------------------------- | -------- |
| name              | string   | Field name for the form controller             | Yes      |
| control           | object   | React Hook Form control object                 | Yes      |
| label             | string   | Label text for the textarea                    | No       |
| required          | boolean  | Whether the field is required                  | No       |
| placeholder       | string   | Placeholder text                               | No       |
| disabled          | boolean  | Whether the textarea is disabled               | No       |
| rules             | object   | React Hook Form validation rules               | No       |
| onChange          | function | Additional onChange handler                    | No       |
| defaultValue      | any      | Default value for the textarea                 | No       |
| errors            | object   | Form errors object                             | No       |
| className         | string   | Additional class name for the container        | No       |
| textareaClassName | string   | Additional class name for the textarea element | No       |
| rows              | number   | Number of rows for the textarea                | No       |
| maxLength         | number   | Maximum length of the textarea                 | No       |

## SharedDatePicker

A reusable date picker component that integrates with React Hook Form's Controller.

### Features

- Integrates with React Hook Form
- Handles validation and error display
- Support for date ranges (start/end dates)
- Date and time selection
- Year and month pickers
- Date exclusions (weekends, holidays, etc.)
- Min/max date constraints
- Customizable date formats

### Usage

```jsx
import { useForm } from "react-hook-form";
import SharedDatePicker from "./SharedDatePicker";

const MyForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Watch start date to set minimum end date
  const startDate = watch("startDate");

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SharedDatePicker
        name="birthDate"
        label="Date of Birth"
        control={control}
        required={true}
        errors={errors}
        placeholder="Select your date of birth"
        maxDate={new Date()} // Can't select future dates
        showYearDropdown={true}
        showMonthDropdown={true}
      />

      <SharedDatePicker
        name="startDate"
        label="Start Date"
        control={control}
        required={true}
        errors={errors}
      />

      <SharedDatePicker
        name="endDate"
        label="End Date"
        control={control}
        required={true}
        errors={errors}
        minDate={startDate ? new Date(startDate) : null}
        disabled={!startDate}
      />

      <button type="submit">Submit</button>
    </form>
  );
};
```

### Props

| Prop              | Type         | Description                                | Required |
| ----------------- | ------------ | ------------------------------------------ | -------- |
| name              | string       | Field name for the form controller         | Yes      |
| control           | object       | React Hook Form control object             | Yes      |
| label             | string       | Label text for the date picker             | No       |
| required          | boolean      | Whether the field is required              | No       |
| placeholder       | string       | Placeholder text                           | No       |
| disabled          | boolean      | Whether the date picker is disabled        | No       |
| rules             | object       | React Hook Form validation rules           | No       |
| onChange          | function     | Additional onChange handler                | No       |
| defaultValue      | Date\|string | Default value for the date picker          | No       |
| errors            | object       | Form errors object                         | No       |
| className         | string       | Additional class name for the container    | No       |
| dateFormat        | string       | Date format string (default: "dd/MM/yyyy") | No       |
| showTimeSelect    | boolean      | Whether to show time selection             | No       |
| showYearDropdown  | boolean      | Whether to show year dropdown              | No       |
| showMonthDropdown | boolean      | Whether to show month dropdown             | No       |
| isClearable       | boolean      | Whether to show clear button               | No       |
| minDate           | Date         | Minimum selectable date                    | No       |
| maxDate           | Date         | Maximum selectable date                    | No       |
| excludePastDates  | boolean      | Whether to exclude past dates              | No       |
| excludeDates      | Array        | Array of dates to exclude                  | No       |
