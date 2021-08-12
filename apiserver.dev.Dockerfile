# pull official base image
FROM python:3.8-alpine

# set working directory
WORKDIR /app

#install Rust & Cargo [required for python cryptography]
RUN apk add gcc musl-dev python3-dev libffi-dev openssl-dev cargo

# add app
COPY ./VTCheckSVC ./

RUN pip install -r requirements.txt

#Run Flask from the Command Line to Reloads
ENTRYPOINT FLASK_APP=/app/app.py flask run --host=0.0.0.0

#ENTRYPOINT [ "python" ]

#CMD [ "app.py" ]