拉取项目后 先进行依赖安装
pnpm i

依赖安装完成后 若启动遇到问题 请查看pnpm-workspace.yaml 将每项内容设置为true

# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod

