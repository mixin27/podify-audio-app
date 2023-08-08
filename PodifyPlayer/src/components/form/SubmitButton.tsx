import AppButton from '@ui/AppButton';
import {useFormikContext} from 'formik';
import {FC} from 'react';

interface Props {
  title: string;
}

const SubmitButton: FC<Props> = props => {
  const {handleSubmit, isSubmitting} = useFormikContext();

  return (
    <AppButton
      busy={isSubmitting}
      onPressed={handleSubmit}
      title={props.title}
    />
  );
};

export default SubmitButton;
