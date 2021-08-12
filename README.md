<h1 align="center">
  <br>
  <img src="VTCheckWebsite/src/Images/hokiecheck_black_text.svg" width="300">
</h1>

<h4 align="center">A Covid-19 Contact Tracing App created to compete in Virginia Tech's  <a href="https://vtnews.vt.edu/articles/2020/08/fralinlifesci-tech-together-campaign-finalists.html" target="_blank">Tech Together Challenge</a>. Reached finalist standing</h4>

# VTCheck

## Project Information

VTCheck is a mobile and web application for Virginia Tech to view and manage occupancies around campus. Doors will be outfitted with minimalistic, non-intrusive tags, and using NFC technology and QR codes, students and faculty will check-in to classrooms, dining halls, and study spaces. Other forms of occupancy detection can be used as well. These groups will be able to view which rooms are open, restricted, or closed at any given time. This allows students and faculty to plan their days accordingly, save time, and avoid piling up in hallways.

With VT Check, administrators can create controls and adjust restrictions on occupancies in key facilities and rooms to better comply with CDC guidelines on social distancing. Furthermore, the data can also be used to facilitate contact tracing initiatives. If a student is reported to have tested positive for COVID-19, the app can be useful for identifying locations that may have been exposed to an infected individual.

This solution allows Virginia Tech as a student body, faculty body, and an administrative body to work as a cohesive unit to optimize our university’s facilities to deal with COVID-19. Administrators can more effectively regulate occupancy, which will help achieve a safe learning environment, while those checking-in and out of rooms will be contributing social awareness about what rooms and buildings are available. This behavior will provide peace of mind both in the context of the virus and outside of it as well.


## Setup

To check out a  copy of this repository:

    git clone https://github.com/cpendery/VTCheck.git

Once you have cloned this repository, you will need to install the VTCheck stack using Docker.
Once you have the environment set up, including making sure Docker is currently running on your machine, you can run the following command:

    make.sh

This command will first pull and build the VTCheck images before instantiating the VTCheck containers. It will also populate the mysql database with the proper tables and starting data.

<h4 align="center"> **The website should now be running** </h4>

## Usage

To view a student profile, register a new account on the site.

To view an admin profile, use these credentials <br> 
`Username: Sameer@vt.edu` <br>
`Password: Password`


## Features
 - User Accounts
 - Admin Account Permission Management
 - Creating, Deleting, & Updating Rooms
 - Signing into & out of rooms
 - Viewing room status
 - Filtering room data

## Mobile App

A mobile iOS app compatable with the api can be found <a href="https://github.com/cpendery/VTCheckNative" target="_blank">here</a>.

## Demos

Linked below are the ending set of demos:

<a href="https://m.youtube.com/watch?v=n5zi71NIN6c&feature=youtu.be" target="_blank">Stage 3 Demo</a>

<a href="https://m.youtube.com/watch?v=8vspsrrvM8M&feature=youtu.be" target="_blank">Final Stage Demo</a>

## Known Bugs
 - Encryption: *The VTCheckSVC/creds.py file shouldn't be posted publiclly, but as this project isn't hosted its totally fine*
 - Refresh: *data doesn't refresh upon action unless manual refresh occurs*
 - Contact Tracing: *contact tracing has not yet been implemented*
