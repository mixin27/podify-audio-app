import FileSelector from '@components/FileSelector';
import CategorySelector from '@components/category_selector';
import AppButton from '@ui/AppButton';
import Progress from '@ui/Progress';
import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';
import {categories} from '@utils/categories';
import colors from '@utils/colors';
import {mapRange} from '@utils/math';
import {FC, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {DocumentPickerResponse, types} from 'react-native-document-picker';
import MdiIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import client from 'src/api/client';
import * as yup from 'yup';

interface FormFields {
  title: string;
  category: string;
  about: string;
  file?: DocumentPickerResponse;
  poster?: DocumentPickerResponse;
}

const defaultForm: FormFields = {
  title: '',
  category: '',
  about: '',
};

const audioInfoSchema = yup.object().shape({
  title: yup.string().trim().required('Title is required'),
  category: yup.string().oneOf(categories, 'Category is required'),
  about: yup.string().trim().required('About is required'),
  file: yup.object().shape({
    uri: yup.string().required('Audio file is required'),
    name: yup.string().required('Audio file is required'),
    type: yup.string().required('Audio file is required'),
    size: yup.number().required('Audio file is required'),
  }),
  poster: yup.object().shape({
    uri: yup.string(),
    name: yup.string(),
    type: yup.string(),
    size: yup.number(),
  }),
});

interface Props {}

const Upload: FC<Props> = props => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [audioInfo, setAudioInfo] = useState({...defaultForm});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  const handleUpload = async () => {
    setBusy(true);
    try {
      const params = await audioInfoSchema.validate(audioInfo);
      const formData = new FormData();
      formData.append('title', params.title);
      formData.append('about', params.about);
      formData.append('category', params.category);
      formData.append('file', {
        name: params.file.name,
        type: params.file.type,
        uri: params.file.uri,
      });

      if (params.poster.uri) {
        formData.append('poster', {
          name: params.poster.name,
          type: params.poster.type,
          uri: params.poster.uri,
        });
      }

      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

      const {data} = await client.post('/audio/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress(progressEvent) {
          const uploaded = mapRange({
            inputMin: 0,
            inputMax: progressEvent.total || 0,
            outputMin: 0,
            outputMax: 100,
            inputValue: progressEvent.loaded,
          });

          setUploadProgress(Math.floor(uploaded));
        },
      });

      console.log(data);
    } catch (error) {
      if (error instanceof yup.ValidationError)
        console.log('Validation error: ', error);
      else console.log(error);
    }
    setBusy(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.fileSelectorContainer}>
        <FileSelector
          icon={
            <MdiIcon name="image-outline" size={35} color={colors.SECONDARY} />
          }
          btnTitle="Select Poster"
          options={{type: [types.images]}}
          onSelect={poster => {
            setAudioInfo({...audioInfo, poster});
          }}
        />
        <FileSelector
          icon={
            <MdiIcon
              name="file-music-outline"
              size={35}
              color={colors.SECONDARY}
            />
          }
          btnTitle="Select Audio"
          style={{marginLeft: 20}}
          options={{type: [types.audio]}}
          onSelect={file => {
            setAudioInfo({...audioInfo, file});
          }}
        />
      </View>

      <View style={styles.fromContainer}>
        <TextInput
          placeholder="Title"
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          style={styles.input}
          onChangeText={text => {
            setAudioInfo({...audioInfo, title: text});
          }}
        />

        <Pressable
          style={styles.categorySelector}
          onPress={() => {
            setShowCategoryModal(true);
          }}>
          <Text style={styles.categorySelectorTitle}>Category</Text>
          <Text style={styles.selectedCategory}>{audioInfo.category}</Text>
        </Pressable>

        <TextInput
          placeholder="About"
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          style={styles.input}
          numberOfLines={10}
          multiline
          onChangeText={text => {
            setAudioInfo({...audioInfo, about: text});
          }}
        />

        <CategorySelector
          visible={showCategoryModal}
          onRequestClose={() => {
            setShowCategoryModal(false);
          }}
          title="Category"
          data={categories}
          renderItem={item => {
            return <Text style={styles.category}>{item}</Text>;
          }}
          onSelect={(item, _) => {
            setAudioInfo({...audioInfo, category: item});
          }}
        />

        <View style={{marginVertical: 20}}>
          {busy ? <Progress progress={uploadProgress} /> : null}
        </View>

        <AppButton
          busy={busy}
          borderRadius={7}
          title="Submit"
          onPressed={handleUpload}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  fileSelectorContainer: {
    flexDirection: 'row',
  },
  fromContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    padding: 10,
    fontSize: 18,
    color: colors.CONTRAST,
    textAlignVertical: 'top',
  },
  category: {
    padding: 10,
    color: colors.PRIMARY,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  categorySelectorTitle: {
    color: colors.CONTRAST,
  },
  selectedCategory: {
    color: colors.SECONDARY,
    marginLeft: 5,
    fontStyle: 'italic',
  },
});

export default Upload;
