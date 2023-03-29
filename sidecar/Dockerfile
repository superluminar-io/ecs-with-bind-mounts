FROM public.ecr.aws/lts/ubuntu:latest

RUN apt update && \
  apt install -q -y curl unzip && \
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install

COPY run.sh .

CMD ["./run.sh"]
