import AppButton from '@ui/AppButton';
import {useFormikContext} from 'formik';
import {FC} from 'react';

interface Props {
  title: string;
}

const SubmitButton: FC<Props> = props => {
  const {handleSubmit} = useFormikContext();

  return <AppButton onPressed={handleSubmit} title={props.title} />;
};

export default SubmitButton;
