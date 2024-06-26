import React from 'react';
import {
  //uploadData,
  list,
  getProperties,
  remove,
  downloadData,
} from 'aws-amplify/storage';
import { Flex, Button, Text } from '@aws-amplify/ui-react';
import { StorageManager, StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { ItemPlaceholder } from './ItemPlaceholder';

export function UploadPage() {
  // const [file, setFile] = React.useState();
  const [files, setFiles] = React.useState([]);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState('' as string);
  const [isLoading, setIsLoading] = React.useState(false);

  // const handleChange = (event: { target } | null) => {
  //   setFile(event?.target?.files[0]);
  // };

  // async function handleUpload() {
  //   try {
  //     setIsLoading(true);
  //     console.log(file);

  //     await uploadData({
  //       path: `personal-files/${file?.name}`,
  //       data: file,
  //     });
  //     setIsLoading(false);
  //     listFiles();
  //   } catch (error) {
  //     console.log('Error uploading file: ', error);
  //   }
  // }

  async function listFiles() {
    try {
      setIsLoading(true);
      const results: { items: object[] } = await list({
        path: 'personal-files/',
      });
      let { items } = results;

      items = await Promise.all(
        items.map(async (item: { path: string }) => {
          const filePropeties = await getProperties({
            path: item.path,
          });

          console.log('File properties: ', filePropeties);
          return filePropeties;
        })
      );

      setFiles(items);
    } catch (error) {
      console.error('Error listing files ', error);
    }
    setIsLoading(false);
  }

  async function handleDownload(path: string) {
    try {
      const { body, eTag } = await downloadData({
        path,
        options: {
          onProgress: (event) => {
            console.log(event.transferredBytes);
          },
        },
      }).result;
      const blob = await body.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', path.split('/')[1]);
      document.body.appendChild(link);
      link.click();

      console.log('Downloaded file: ', body, eTag);
    } catch (error) {
      console.log('Error downloading file: ', error);
    }
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

      {isLoading ? (
        //  {/* Placeholders */}
        <Flex
          direction='column'
          gap='8px'>
          <ItemPlaceholder isLoaded={!isLoading}></ItemPlaceholder>
          <ItemPlaceholder isLoaded={!isLoading}></ItemPlaceholder>
          <ItemPlaceholder isLoaded={!isLoading}></ItemPlaceholder>
          <div className='mb-8'></div>
        </Flex>
      ) : (
        // {/* File Lists */}
        <ul>
          {files.map(
            (file: { eTag: string; path: string; contentType: string }) =>
              isDeleting && deleteId === file.eTag ? (
                <div className='mblock-8'>
                  <ItemPlaceholder isLoaded={false}></ItemPlaceholder>
                </div>
              ) : (
                <li key={file.eTag}>
                  <Flex
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    gap='1rem'>
                    <Flex alignItems='center'>
                      <div className='preview'>
                        {file.contentType.startsWith('image/') ? (
                          <StorageImage
                            path={file.path}
                            alt=''
                            fallbackSrc='read-only/image-placeholder.png'
                          />
                        ) : (
                          <FontAwesomeIcon icon={faFile} />
                        )}
                      </div>
                      <Text>{file.path.split('/')[1]}</Text>
                    </Flex>

                    <Flex>
                      <Button
                        variation='link'
                        onClick={() => handleDownload(file.path)}>
                        Download
                      </Button>
                      <Button
                        // loadingText='Deleting...'
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
                  </Flex>
                </li>
              )
          )}
        </ul>
      )}
    </div>
  );
}
