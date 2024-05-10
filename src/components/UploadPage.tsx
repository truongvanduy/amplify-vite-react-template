import React from 'react';
import { uploadData, list, remove } from 'aws-amplify/storage';
import { Flex, Button, Text, Placeholder } from '@aws-amplify/ui-react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

export function UploadPage() {
  const [file, setFile] = React.useState();
  const [files, setFiles] = React.useState([]);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState('' as string);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (event: { target } | null) => {
    setFile(event?.target?.files[0]);
  };

  async function handleUpload() {
    try {
      setIsLoading(true);
      console.log(file);

      await uploadData({
        path: `personal-files/${file.name}`,
        file,
      }).result;
      setIsLoading(false);
      listFiles();
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function listFiles() {
    try {
      setIsLoading(true);
      const results: { items: object[] } = await list({
        path: 'personal-files/',
      });
      setFiles(results.items);
    } catch (error) {
      console.error('Error listing files ', error);
    }
    setIsLoading(false);
  }

  async function deleteData({ path, id }: { path: string; id: string }) {
    try {
      setIsDeleting(true);
      setDeleteId(id);

      await remove({
        path,
      });

      setIsDeleting(false);
      setDeleteId('');

      listFiles();
    } catch (error) {
      console.error('Error deleting file ', error);
    }
  }

  React.useEffect(() => {
    listFiles();
  }, []);

  return (
    <div>
      {/* <input
        type='file'
        onChange={handleChange}
      /> */}
      <StorageManager
        path='personal-files/'
        maxFileCount={1}
        isResumable
        onUploadSuccess={() => {
          listFiles();
        }}
        components={{
          FileList: () => null,
        }}
      />
      {/* <button onClick={handleUpload}>Upload</button> */}

      <hr />

      <Flex direction='column'>
        <Placeholder
          isLoaded={!isLoading}
          size='large'></Placeholder>
        <Placeholder
          isLoaded={!isLoading}
          size='large'></Placeholder>
        <Placeholder
          isLoaded={!isLoading}
          size='large'></Placeholder>
      </Flex>
      <ul>
        {files.map((file: any) => (
          <li key={file.eTag}>
            <Flex
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              gap='1rem'>
              <Text>{file.path.split('/')[1]}</Text>
              <Button
                loadingText='Deleting...'
                isLoading={isDeleting && deleteId === file.eTag}
                onClick={() =>
                  deleteData({
                    path: file.path,
                    id: file.eTag,
                  })
                }>
                Delete
              </Button>
            </Flex>
          </li>
        ))}
      </ul>
    </div>
  );
}
