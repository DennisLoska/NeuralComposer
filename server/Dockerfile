FROM ubuntu:16.04
WORKDIR ./server/
FROM python:3.6
RUN pip install --upgrade pip
ADD server-requirements.txt .
CMD [ "npm", "start", "--host", "0.0.0.0" ]
