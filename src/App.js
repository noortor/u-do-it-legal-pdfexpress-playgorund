import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/pdfjs-express';
import './App.css';

const App = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/Proof_of_Service_of_Summons_-_FL115.pdf',
      },
      viewer.current,
    ).then((instance) => {
      const { docViewer, Annotations } = instance;
      const annotManager = docViewer.getAnnotationManager();
      const fieldManager = annotManager.getFieldManager();

      docViewer.on('documentLoaded', () => {
        const rectangleAnnot = new Annotations.RectangleAnnotation();
        rectangleAnnot.PageNumber = 1;
        // values are in page coordinates with (0, 0) in the top left
        rectangleAnnot.X = 100;
        rectangleAnnot.Y = 150;
        rectangleAnnot.Width = 200;
        rectangleAnnot.Height = 50;
        rectangleAnnot.Author = annotManager.getCurrentUser();

        annotManager.addAnnotation(rectangleAnnot);
        // need to draw the annotation otherwise it won't show up until the page is refreshed
        annotManager.redrawAnnotation(rectangleAnnot);
        console.log(Annotations);
        // annotManager.exportAnnotCommand()
        // console.log(xfdfString);
      });

      const checkField = (field) => {
        // Do something with data
        const { name, value } = field;
        console.log(name, value)
        // Check children fields
        field.children.forEach(checkField);
      }

      annotManager.on('fieldChanged', (field, value) => {
        // Do something with data
        console.log(field.name, value)
      })

      docViewer.on('annotationsLoaded', function () {
        fieldManager.forEachField(checkField);
      });

    });
  }, []);

  return (
    <div className="App">
      <div className="header">React Pog</div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
