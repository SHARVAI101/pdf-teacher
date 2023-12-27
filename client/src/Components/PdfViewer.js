import React from 'react'

function PdfViewer({ pdfPath }) {
  return (

    <iframe
      src={pdfPath}
      className='h-full py-2'
    //   style={{ width: '100%', height: '100%' }}
      frameBorder="0"
    >
      Sorry, your browser does not support inline PDFs.
    </iframe>
  )
}

export default PdfViewer