<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">T4AForge</h3>

  <p align="center">
    T4AForge is a powerful and flexible tool designed to streamline mass filing of T4A slips. The app accepts a CSV file and generates an XML file that you can submit through Internet file transfer. 
    <br />
    <br />
    <a href="https://github.com/ZhichGaming/T4AForge/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/ZhichGaming/T4AForge/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![T4AForge Screen Shot][product-screenshot]

Commits got messed up with the boilerplate's due to a bad initial project setup. If you know how to automatically squash all boilerplate commits while conserving the ones respective to this project, please make a PR or contact me.


### Built With

* [![React][React.js]][React-url]
* [![Electron][Electron]][Electron-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ZhichGaming/T4AForge.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the app
   ```sh
   npm start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- FEATURE EXAMPLES -->
## Features

![T4AForge Screen Shot][import-screenshot]

Import a CSV and T4AForge will try to assign a field for T4A slip to each of your table columns. If the program can't find the corresponding field, you can choose it yourself manually as well.

![T4AForge Screen Shot][validation-screenshot]

The app validates each step of your submission using the requirements from the government website's specification, from the imported slips to your transmitter information.

![T4AForge Screen Shot][summary-screenshot]

Fields will be autocompleted from other fields when possible.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

No new features planned at the moment, propose one by opening a GitHub issue.

See the [open issues](https://github.com/ZhichGaming/T4AForge/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Project Link: [https://github.com/ZhichGaming/T4AForge](https://github.com/ZhichGaming/T4AForge)
Email: nick.zhicheng@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* Project bootstrapped from [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/ZhichGaming/T4AForge.svg?style=for-the-badge
[contributors-url]: https://github.com/ZhichGaming/T4AForge/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ZhichGaming/T4AForge.svg?style=for-the-badge
[forks-url]: https://github.com/ZhichGaming/T4AForge/network/members
[stars-shield]: https://img.shields.io/github/stars/ZhichGaming/T4AForge.svg?style=for-the-badge
[stars-url]: https://github.com/ZhichGaming/T4AForge/stargazers
[issues-shield]: https://img.shields.io/github/issues/ZhichGaming/T4AForge.svg?style=for-the-badge
[issues-url]: https://github.com/ZhichGaming/T4AForge/issues
[license-shield]: https://img.shields.io/github/license/ZhichGaming/T4AForge?style=for-the-badge
[license-url]: https://github.com/ZhichGaming/T4AForge/blob/master/LICENSE
[product-screenshot]: images/screenshot.png
[import-screenshot]: images/import-screenshot.png
[validation-screenshot]: images/validation-screenshot.png
[summary-screenshot]: images/summary-screenshot.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Electron]: https://img.shields.io/badge/-electron-F1C40F?style=for-the-badge&labelColor=17202A&logo=electron&logoColor=61DBFB
[Electron-url]: https://electronjs.org
