### usage

##### get token

    curl -X POST -d '{"username":"crm_user", "password":"j0f2bx4w1"}' -H "Content-Type: application/json" localhost:3000/api/auth

##### get sample data (profile)

    curl -X GET -H "Authorization: JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOiIyMDE5LTAzLTAyVDEyOjI5OjE5LjM1NVoiLCJ1c2VybmFtZSI6ImNybV91c2VyIiwicGFzc3dvcmQiOiJqMGYyYng0dzEifQ.djbuzJVikqwPuUZix0k4rUx6n1DJUnaqi-9jOfBWvDU" -H "Content-Type: application/json" localhost:3000/api/profile

##### get trial bundles

    curl -X GET -H "Authorization: JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOiIyMDE5LTAzLTAyVDEyOjI5OjE5LjM1NVoiLCJ1c2VybmFtZSI6ImNybV91c2VyIiwicGFzc3dvcmQiOiJqMGYyYng0dzEifQ.djbuzJVikqwPuUZix0k4rUx6n1DJUnaqi-9jOfBWvDU" -H "Content-Type: application/json" localhost:3000/api/bundle



## Setup process

You can use ***setup-simple.sh*** for install mock data.


## Process

for better perspecte of project dimention, it's better to use UML diagram for visualization and graphical view

#### A) step one

serial number send for user by email manually


#### B) step two

first contact has been done by client and with below payload

    {
        license: <license_number>,
        client_public_key: <public key string>
    }

This step happen only one time and in the rest we store public key and use it. Server automatically send response with 'STATUS' property.

    {
        status: <number>  // e.g "67596961570"
    }


#### C) periodical connection of AXLE and DanaLicenseServer

Danalica local engine connect to License Server permanently and give report from visitor statistic. Already this cause blocking danalica local engine immediately.

    {
        uid: (new Date().getTime()).toString()
    }

After check incoming request, server send responce with 'STATUS' property

    {
        status: <number>  // e.g "67596961570"
    }

This 'STATUS' will decode with specific algorithm and will show somthing like below.

    {
        status: "bundles expire"
    }


#### D) daily contact for accessing AXLE and reporting

every day danalica engine must give report as what happen in local system and the number of remain visit during last day

    {
        hits: 500,
        uid: (new Date().getTime()).toString()
    }


![sample diagram](dev-doc/images/danalicense-v1_(4).1-use_case_first_connection.png)



## Install database and mock data

At first we need use predefined datbase schema that sutable for test and development.

    mongo -u <username> -p <password> <databasename>

in this example

    mongo -u d5h2S8m0I -p hf3w2nE2 danalica

Then load executable javascript file for lunching automatic data entry

    load('/data/db/file.js')


## Simulate client connection

In case that we want to check project, we can use below endpoint and call related method for execute the simple test.

    curl http://localhost/client/usage
