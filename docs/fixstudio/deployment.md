# Deployment on FixStudio Docker

## Informations

Fix Wiki is stored on a Github private repo : https://github.com/kekefreedog/fixstudio_wiki.git

## How update code in prod

1. I open VSCODE
2. I connect to SSH :
```
Host fixwiki
  HostName fixwiki
  User support
```
1. It asks me a password which is `Fixstudio33`
2. When connected is succeeded, I open a terminal and I execute the command below
```
sudo docker exec -ti 7aba9b030ce1 /bin/bash
```
1. It asks me for a password which is `Fixstudio33`
2. Inside the docker bash, I go on the parent folder with the command below
```
cd ..
```
1. Finally I pull the new code with the command bellow : 
```
git pull origin deployment
```

> For information I push new codes for FixStudio in the branch `deployment`

Here we are :)