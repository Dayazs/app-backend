拉取项目后 先进行依赖安装
pnpm i

依赖安装完成后 若启动遇到问题 请查看pnpm-workspace.yaml 将每项内容设置为true

# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod

后台管理后缀 /backend
app后缀     /app



# AI Agent App 后端项目结构与文件职责说明

> 项目定位：AI Agent + 日程 / 待办 / 账单 / 行程
> 推荐技术栈：NestJS + TypeScript + PostgreSQL
> 核心原则：**按业务领域拆分，而不是按 controller / service / repository 全局拆分。**

------

# 1. 整体目录结构

```text
src/
│
├── main.ts
├── app.module.ts
│
├── modules/
│   │
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── dto/
│   │
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.entity.ts
│   │   └── user.module.ts
│   │
│   ├── todo/
│   │   ├── todo.controller.ts
│   │   ├── todo.service.ts
│   │   ├── todo.repository.ts
│   │   ├── todo.entity.ts
│   │   ├── todo.dto.ts
│   │   └── todo.module.ts
│   │
│   ├── calendar/
│   │   ├── calendar.controller.ts
│   │   ├── calendar.service.ts
│   │   ├── calendar.repository.ts
│   │   ├── calendar.entity.ts
│   │   ├── calendar.dto.ts
│   │   └── calendar.module.ts
│   │
│   ├── bill/
│   │   ├── bill.controller.ts
│   │   ├── bill.service.ts
│   │   ├── bill.repository.ts
│   │   ├── bill.entity.ts
│   │   ├── bill.dto.ts
│   │   └── bill.module.ts
│   │
│   ├── trip/
│   │   ├── trip.controller.ts
│   │   ├── trip.service.ts
│   │   ├── trip.repository.ts
│   │   ├── trip.entity.ts
│   │   ├── trip.dto.ts
│   │   └── trip.module.ts
│   │
│   ├── agent/
│   │   ├── agent.service.ts
│   │   ├── agent.controller.ts
│   │   ├── agent.module.ts
│   │   │
│   │   ├── tools/
│   │   │   ├── create-todo.tool.ts
│   │   │   ├── update-todo.tool.ts
│   │   │   ├── create-event.tool.ts
│   │   │   ├── create-bill.tool.ts
│   │   │   └── create-trip.tool.ts
│   │   │
│   │   └── prompts/
│   │       ├── system.prompt.ts
│   │       └── planner.prompt.ts
│   │
│   ├── notification/
│   │   ├── notification.service.ts
│   │   └── notification.module.ts
│   │
│   ├── subscription/
│   │   ├── subscription.service.ts
│   │   ├── subscription.controller.ts
│   │   └── subscription.module.ts
│   │
│   └── admin/
│       ├── admin.module.ts
│       │
│       ├── admin-auth/
│       │   ├── admin-auth.controller.ts
│       │   └── admin-auth.service.ts
│       │
│       ├── users/
│       │   ├── admin-users.controller.ts
│       │   └── admin-users.service.ts
│       │
│       ├── bills/
│       │   ├── admin-bills.controller.ts
│       │   └── admin-bills.service.ts
│       │
│       └── dashboard/
│           ├── dashboard.controller.ts
│           └── dashboard.service.ts
│
├── common/
│   ├── guards/
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   ├── middleware/
│   └── types/
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── config/
│   ├── database.config.ts
│   ├── auth.config.ts
│   └── ai.config.ts
│
└── infrastructure/
    ├── openai/
    ├── stripe/
    ├── email/
    ├── push/
    └── storage/
```

------

# 2. 核心架构原则

整个项目遵循：

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

第三方服务则通过：

```text
Service
    ↓
Infrastructure
    ↓
OpenAI / Stripe / Push / Email / Storage
```

Agent：

```text
Agent
    ↓
Tool
    ↓
Business Service
    ↓
Repository
    ↓
Database
```

核心原则：

> **App、Admin、Agent 可以有多个入口，但业务逻辑尽量只有一份。**

------

# 3. src/main.ts

## 作用

整个 NestJS 后端的启动入口。

主要负责：

- 启动 NestJS
- 创建 App
- 注册全局配置
- 注册全局 Validation
- 注册全局 Prefix
- 注册全局 Guard / Filter / Interceptor
- 监听端口

可以理解为：

```text
服务器启动按钮
```

示例：

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
}

bootstrap();
```

------

# 4. src/app.module.ts

## 作用

整个项目的总模块。

负责把所有业务模块组装起来。

例如：

```ts
@Module({
  imports: [
    AuthModule,
    UserModule,
    TodoModule,
    CalendarModule,
    BillModule,
    TripModule,
    AgentModule,
    NotificationModule,
    SubscriptionModule,
    AdminModule,
  ],
})
export class AppModule {}
```

可以理解成：

```text
AppModule
    ├── AuthModule
    ├── UserModule
    ├── TodoModule
    ├── CalendarModule
    ├── BillModule
    ├── TripModule
    ├── AgentModule
    ├── NotificationModule
    ├── SubscriptionModule
    └── AdminModule
```

------

# 5. modules/

## 作用

存放产品的核心业务。

建议按照业务领域拆分：

```text
auth
user
todo
calendar
bill
trip
agent
notification
subscription
admin
```

不要一开始使用：

```text
controllers/
services/
repositories/
models/
```

这种全局技术分类。

推荐：

```text
todo/
    todo.controller.ts
    todo.service.ts
    todo.repository.ts
```

这样一个业务的所有代码都集中在一起。

------

# 6. auth/

```text
auth/
├── auth.controller.ts
├── auth.service.ts
├── auth.module.ts
└── dto/
```

## 作用

负责用户身份认证。

包括：

- 注册
- 登录
- Token
- Refresh Token
- OAuth
- 密码验证
- 登出

------

## auth.controller.ts

负责 HTTP API。

例如：

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

Controller 不负责具体业务逻辑。

结构：

```text
Request
    ↓
AuthController
    ↓
AuthService
```

------

## auth.service.ts

负责认证业务。

例如：

```ts
register()
login()
refreshToken()
logout()
validateUser()
```

------

## auth.module.ts

负责组装 Auth 相关依赖。

------

## dto/

DTO = Data Transfer Object。

定义 API 接收的数据格式。

例如：

```text
login.dto.ts
register.dto.ts
refresh-token.dto.ts
```

示例：

```ts
class LoginDto {
  email: string;
  password: string;
}
```

------

# 7. user/

```text
user/
├── user.controller.ts
├── user.service.ts
├── user.repository.ts
├── user.entity.ts
└── user.module.ts
```

## 作用

负责用户资料和用户相关业务。

例如：

- 获取个人资料
- 修改昵称
- 修改头像
- 修改时区
- 用户设置

------

## user.controller.ts

负责：

```text
GET /api/v1/users/me
PATCH /api/v1/users/me
```

------

## user.service.ts

负责：

```text
getProfile()
updateProfile()
changeTimezone()
```

------

## user.repository.ts

负责数据库查询。

例如：

```text
findById()
findByEmail()
updateUser()
```

原则：

> Repository 负责数据访问，不负责复杂业务规则。

------

## user.entity.ts

描述数据库里的 User 模型。

例如：

```text
users
├── id
├── email
├── name
├── timezone
├── created_at
└── updated_at
```

如果项目使用 Prisma，可以由 `schema.prisma` 承担主要模型定义，不一定需要独立 `entity.ts`。

------

# 8. todo/

```text
todo/
├── todo.controller.ts
├── todo.service.ts
├── todo.repository.ts
├── todo.entity.ts
├── todo.dto.ts
└── todo.module.ts
```

## 作用

管理待办。

包括：

- 创建 Todo
- 修改 Todo
- 完成 Todo
- 删除 Todo
- 设置截止时间
- 重排
- 重复任务

------

## todo.controller.ts

例如：

```text
GET    /api/v1/todos
POST   /api/v1/todos
GET    /api/v1/todos/:id
PATCH  /api/v1/todos/:id
DELETE /api/v1/todos/:id
```

------

## todo.service.ts

负责具体业务：

```text
createTodo()
updateTodo()
completeTodo()
deleteTodo()
rescheduleTodo()
```

------

## todo.repository.ts

负责：

```text
insertTodo()
findTodoById()
findTodosByUser()
updateTodo()
deleteTodo()
```

------

## todo.entity.ts

对应数据库中的：

```text
todos
```

------

## todo.dto.ts

定义：

```text
CreateTodoDto
UpdateTodoDto
```

例如：

```ts
class CreateTodoDto {
  title: string;
  dueAt?: Date;
}
```

------

# 9. calendar/

```text
calendar/
├── calendar.controller.ts
├── calendar.service.ts
├── calendar.repository.ts
├── calendar.entity.ts
├── calendar.dto.ts
└── calendar.module.ts
```

## 作用

管理日程。

包括：

- 创建日程
- 修改日程
- 删除日程
- 查询日程
- 查询某天
- 查询时间范围
- 重复日程

例如：

```text
POST  /api/v1/calendar/events
GET   /api/v1/calendar/events
PATCH /api/v1/calendar/events/:id
DELETE /api/v1/calendar/events/:id
```

------

# 10. bill/

```text
bill/
├── bill.controller.ts
├── bill.service.ts
├── bill.repository.ts
├── bill.entity.ts
├── bill.dto.ts
└── bill.module.ts
```

## 作用

管理用户账单与消费。

例如：

- 记录支出
- 固定账单
- 标记已支付
- 修改金额
- 分类
- 本月消费统计

例如：

```text
“这个月我花了多少钱？”
```

最终由：

```text
BillService
```

负责处理。

------

# 11. trip/

```text
trip/
├── trip.controller.ts
├── trip.service.ts
├── trip.repository.ts
├── trip.entity.ts
├── trip.dto.ts
└── trip.module.ts
```

## 作用

管理旅行和行程。

例如：

```text
Trip
├── destination
├── startDate
├── endDate
├── budget
└── items
```

Trip Item 可以包括：

```text
酒店
交通
餐厅
景点
活动
```

以后 Trip 变复杂后，可以进一步拆：

```text
trip/
├── trip/
├── trip-item/
├── reservation/
└── transportation/
```

第一版不需要。

------

# 12. agent/

```text
agent/
├── agent.service.ts
├── agent.controller.ts
├── agent.module.ts
│
├── tools/
│   ├── create-todo.tool.ts
│   ├── update-todo.tool.ts
│   ├── create-event.tool.ts
│   ├── create-bill.tool.ts
│   └── create-trip.tool.ts
│
└── prompts/
    ├── system.prompt.ts
    └── planner.prompt.ts
```

## 作用

AI Agent 的核心模块。

目标：

```text
用户说一句话
    ↓
Agent 理解
    ↓
选择 Tool
    ↓
执行业务
    ↓
返回结果
```

例如：

> “周五下午 3 点提醒我交房租，金额 8500。”

Agent 可以拆成：

```text
createBill()
createTodo()
createEvent()
```

------

# 13. agent.controller.ts

Agent 的 API 入口。

例如：

```text
POST /api/v1/agent/chat
```

请求：

```json
{
  "message": "周五下午3点提醒我交房租"
}
```

Controller 只负责接收请求和调用 AgentService。

------

# 14. agent.service.ts

Agent 的协调中心。

负责：

```text
用户输入
 ↓
LLM
 ↓
理解意图
 ↓
选择 Tool
 ↓
执行 Tool
 ↓
整理结果
 ↓
返回用户
```

不要在这里直接写 SQL。

------

# 15. agent/tools/

## 作用

定义 Agent 可以执行的能力。

例如：

```text
create-todo.tool.ts
update-todo.tool.ts
create-event.tool.ts
create-bill.tool.ts
create-trip.tool.ts
```

每个 Tool 代表一个明确操作。

例如：

```text
createTodoTool
    ↓
TodoService.createTodo()
```

而不是：

```text
Agent
    ↓
SQL
    ↓
Database
```

------

# 16. Agent Tool 的正确架构

```text
Mobile App
    │
    ▼
AgentController
    │
    ▼
AgentService
    │
    ▼
createTodoTool
    │
    ▼
TodoService
    │
    ▼
TodoRepository
    │
    ▼
PostgreSQL
```

这样：

```text
App
 ↓
TodoService

Admin
 ↓
TodoService

Agent
 ↓
TodoService
```

三套入口，共享一套核心业务。

------

# 17. agent/prompts/

保存 Agent 使用的 Prompt。

------

## system.prompt.ts

定义 Agent 的身份、规则和边界。

例如：

```text
你是用户的生活助手。

你可以管理：
- Todo
- Calendar
- Bill
- Trip

删除数据必须要求用户确认。
涉及真实支付不得自动执行。
```

------

## planner.prompt.ts

定义 Agent 怎么规划任务。

例如：

```text
如果输入同时包含：
时间 + 事件
优先考虑创建 Calendar Event。

如果输入包含：
金额 + 消费
考虑创建 Bill。

如果输入同时包含：
提醒 + 事项
可以同时创建 Event + Todo。
```

------

# 18. notification/

```text
notification/
├── notification.service.ts
└── notification.module.ts
```

## 作用

统一管理通知。

例如：

- Push
- Email
- App 内通知
- 定时提醒

例如：

```text
“15分钟后有会议”
```

最终：

```text
NotificationService
```

负责发送。

------

# 19. subscription/

```text
subscription/
├── subscription.service.ts
├── subscription.controller.ts
└── subscription.module.ts
```

## 作用

管理订阅制商业模式。

例如：

```text
Free
Pro
```

以及：

```text
订阅开始时间
订阅结束时间
自动续费
订阅状态
```

后续可以连接：

```text
Apple IAP
Google Play Billing
Stripe
```

------

# 20. admin/

Admin 是后台管理系统的 API 层。

```text
admin/
├── admin.module.ts
├── admin-auth/
├── users/
├── bills/
└── dashboard/
```

最重要的原则：

> **Admin 不应该复制一份完整业务系统。**

例如不要：

```text
App TodoService
Admin TodoService
Agent TodoService
```

然后各自维护业务规则。

应该：

```text
App Controller
      ↓
TodoService
      ↑
Admin Controller


Agent Tool
      ↓
TodoService
```

------

# 21. admin/admin-auth/

```text
admin-auth/
├── admin-auth.controller.ts
└── admin-auth.service.ts
```

负责：

- 管理员登录
- 管理员 Token
- 管理员身份验证
- 管理员角色

例如：

```text
POST /admin/v1/auth/login
```

------

# 22. admin/users/

```text
admin-users.controller.ts
admin-users.service.ts
```

负责后台用户管理：

```text
搜索用户
查看用户
禁用用户
查看订阅
查看使用情况
```

Admin Service 负责后台操作流程。

具体 User 业务逻辑尽量复用：

```text
UserService
```

------

# 23. admin/bills/

负责后台账单管理。

例如：

```text
查看账单
搜索账单
处理异常
统计收入
```

不要复制一套 Bill 数据模型。

------

# 24. admin/dashboard/

负责后台数据统计。

例如：

```text
用户总数
活跃用户
付费用户
Agent 调用次数
Todo 创建量
账单数量
订阅收入
AI 成本
```

Dashboard 很多时候是统计型查询：

```text
COUNT
SUM
GROUP BY
AVG
```

后期可以单独增加：

```text
dashboard.repository.ts
```

------

# 25. common/

```text
common/
├── guards/
├── decorators/
├── filters/
├── interceptors/
├── middleware/
└── types/
```

## 作用

存放跨模块通用代码。

原则：

> 只有真正被多个模块共享的东西，才放这里。

不要把所有不想分类的代码都丢进 `common/`。

------

# 26. common/guards/

Guard = 权限门卫。

例如：

```text
JwtAuthGuard
AdminGuard
RolesGuard
```

请求：

```text
GET /admin/v1/users
```

经过：

```text
JWT
 ↓
AdminGuard
 ↓
RolesGuard
 ↓
Controller
```

------

# 27. common/decorators/

定义自定义 Decorator。

例如：

```ts
@CurrentUser()
```

Controller：

```ts
getProfile(
  @CurrentUser() user
) {}
```

这样可以方便获得当前登录用户。

------

# 28. common/filters/

统一处理异常。

比如：

```text
数据库异常
参数错误
业务异常
未知异常
```

最终统一返回：

```json
{
  "code": "INTERNAL_ERROR",
  "message": "Something went wrong"
}
```

------

# 29. common/interceptors/

拦截请求前后执行统一逻辑。

例如：

```text
请求耗时统计
日志
统一 Response
Tracing
```

例：

```text
Request
 ↓
Interceptor
 ↓
Controller
 ↓
Service
 ↓
Interceptor
 ↓
Response
```

------

# 30. common/middleware/

更靠近 HTTP 层的公共处理逻辑。

例如：

```text
Request ID
Logger
Headers
IP
```

------

# 31. common/types/

存放跨模块共享的 TypeScript 类型。

例如：

```text
UserRole
SubscriptionStatus
AgentAction
PaginationParams
```

注意：

业务专属的 DTO 不要全部扔这里。

------

# 32. database/

```text
database/
├── migrations/
└── seeds/
```

专门处理数据库本身。

------

# 33. database/migrations/

Migration = 数据库结构变化记录。

例如：

第一次：

```text
users
todos
```

后来增加：

```text
bills
```

再后来增加：

```text
agent_runs
agent_actions
```

每次数据库结构变化，都创建新的 migration。

好处：

```text
开发环境
测试环境
生产环境
```

都能按照版本同步数据库结构。

------

# 34. database/seeds/

Seed = 初始化数据。

主要用于：

- 开发
- 测试
- Demo
- 本地环境

例如：

```text
测试用户
测试 Todo
测试账单
测试行程
```

------

# 35. config/

```text
config/
├── database.config.ts
├── auth.config.ts
└──
```