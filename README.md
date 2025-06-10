 
 A JavaaScript based web application that configures a DOM based on the YAML files uploaded by the user. Actions include removing, replacing, inserting and altering elements or texts within a web page.

 **SETUP**

    To run the project clone or download this repository 
    and open the web page in a browser by double clicking the index.html file.

    to clone:
    `git clone https://github.com/berkaysaahin/Visionbridge-assignment.git`

    **Code Structure**

    *index.html*
       a basic HTML page that I used as the UI of the project

    *index.css*
        Simple css instructions to make the html page a little more appealing

    *index.js*
        the inline script, consists of two functions:

        handleYamlUpload(): Lets the user to load YAML files and parses them with the js-yaml library, gathering and returning all the actions.

        applyActions(): Executes the actions that's gathered in handleYamlUpload function.

    The repository consists two YAML files to test. With choose files button open the windows file picker, to select multiple files hold the ctrl button and click the files. File picker only shows the yaml extension files. With the upload button the actions can be executed.

    **YAML File Format**

    Files must have a root of *actions* array.
    Each *action* must include a *type* as *remove*, *replace*, *insert* or *alter*

    For *insert* action a valid *target* to place the new element in the target scope, a *position* to determine how it is placed based on the target, and the *element* that will be inserted.

    For *alter* action an *oldValue* and a *newValue* to be changed must be present.

    **Limitations and Assumptions**

    When the upload button is clicked, the application can insert the element repeatedly. Actions are permanent and not changed unless the page is reloaded. If you change the element id and try to apply another action that uses the old id, nothing will happen. If you try to alter a text with one yaml config and try to apply the same values reversed ( like if there is a "ML" text you want to change to "AI" with one file, and then "AI" to "ML" with another file) it executes both actions immediately and may cause unpredictable behaviour.



        