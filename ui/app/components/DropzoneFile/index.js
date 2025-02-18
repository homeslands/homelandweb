/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
};

const thumb = {
  display: 'flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: '100%',
  //   height: '200px',
  padding: 4,
  boxSizing: 'border-box',
  flexDirection: 'column',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: '100%',
  //   height: '100%',
  objectFit: 'cover',
};

export const DropzoneFile = React.memo(
  ({ hidden, accept, disabled, title, onDrop }) => {
    const [files, setFiles] = useState([]);

    const {
      getRootProps,
      getInputProps,
      isFocused,
      isDragAccept,
      isDragReject,
      isDragActive,
    } = useDropzone({
      accept,
      onDrop: acceptedFiles => {
        setFiles(
          acceptedFiles.map(file =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          ),
        );
        onDrop(acceptedFiles);
      },
      disabled: disabled || false,
    });

    const style = useMemo(
      () => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
      }),
      [isFocused, isDragAccept, isDragReject],
    );

    useEffect(
      () =>
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        () => files.forEach(file => URL.revokeObjectURL(file.preview)),
      [],
    );

    const thumbs = files.map(file => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
        </div>
        <p>{file.name}</p>
      </div>
    ));

    return (
      !hidden && (
        <div>
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />

            {!isDragActive && (
              <p>
                {title ||
                  `Drag and drop your files here, or click to select files`}
              </p>
            )}
            {isDragActive && !isDragReject && "Drop it like it's hot!"}
            {isDragReject && 'File type not accepted, sorry!'}
          </div>
          <aside style={thumbsContainer}>{thumbs}</aside>
        </div>
      )
    );
  },
);

DropzoneFile.propTypes = {
  accept: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  hidden: PropTypes.bool,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  onDrop: PropTypes.func.isRequired,
};
