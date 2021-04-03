import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/pdfjs-express';
import './App.css';
import ExpressUtils from '@pdftron/pdfjs-express-utils'


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

      docViewer.on('documentLoaded', async () => {
        // const rectangleAnnot = new Annotations.RectangleAnnotation();
        // rectangleAnnot.PageNumber = 1;
        // // values are in page coordinates with (0, 0) in the top left
        // rectangleAnnot.X = 100;
        // rectangleAnnot.Y = 150;
        // rectangleAnnot.Width = 200;
        // rectangleAnnot.Height = 50;
        // rectangleAnnot.Author = annotManager.getCurrentUser();

        // annotManager.addAnnotation(rectangleAnnot);
        // // need to draw the annotation otherwise it won't show up until the page is refreshed
        // annotManager.redrawAnnotation(rectangleAnnot);
        const utils = new ExpressUtils()

        //console.log(localStorage.getItem('test'))
        // console.log(Annotations);
        const xfdfString = localStorage.getItem('changes')
        console.log(xfdfString)
        //annotManager.importAnnotations(xfdfString);
        utils
          .setFile('http://www.californiafamilylawforms.com/Proof_of_Service_of_Summons_-_FL115.pdf')
          .setXFDF(xfdfString);

        const response = await utils.merge();
        // annotManager.exportAnnotCommand()
        // console.log(xfdfString);
      });

      const checkField = (field) => {
        // Do something with data
        const { name, value } = field;
        // console.log(name, value)
        // Check children fields
        field.children.forEach(checkField);
      }

      annotManager.on('fieldChanged', async (field, value) => {
        // Do something with data
        // console.log(field, value)
        // const xfdfString = await annotManager.exportAnnotCommand();
        // console.log(xfdfString);

        const utils = new ExpressUtils()
        utils.setFile('http://www.californiafamilylawforms.com/Proof_of_Service_of_Summons_-_FL115.pdf')
        //utils.setFile('../public/files/Proof_of_Service_of_Summons_-_FL115.pdf');
        const response = await utils.extract(); // extract XFDF
        const { xfdf } = response;
        const xfdfString = xfdf
        localStorage.setItem('changes', xfdfString)
        console.log(xfdfString);
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
