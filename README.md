# Greenfolio

<br>
## Steps to updating the website after making edits to the app:
1. Update the production build(this creates the dist folder):<br>
   ng build --configuration production --base-href=/greenfolio/

2. Deploy to GitHub Pages using angular-cli-ghpages<br>
   npx angular-cli-ghpages --dir=dist/greenfolio/browser/

<br>
## Learning - Angular Definitions

### Page
A component that is registered in app.routes.ts and loaded through the Angular router. A page represents a full application view.

### Layout
A component that provides structure and is reused across multiple pages, such as a navigation bar or header.<br>
&lt;component-nav-bar&gt;&lt;/component-nav-bar&gt;

### Component
A reusable UI element that is embedded within a page or layout and is not directly routed to.<br>
&lt;component-item&gt;&lt;/component-item&gt;

##
<br><br>
## Learning - Angular Configurations

### Json Notes
Comments cannot be added to an angular.json file.

### Environments
angular.json uses fileReplacements to swap environment files based on build configuration (dev vs prod).<br>
"fileReplacements": [  
   {  
      "replace": "src/environments/environment.ts",  
      "with": "src/environments/environment.prod.ts"  
   }  
]

##
<br><br>
#This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
