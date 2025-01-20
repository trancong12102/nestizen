import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { NestizenModule } from './nestizen/nestizen/nestizen.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        playground: false,
        introspection: true,
        autoSchemaFile: true,
        useGlobalPrefix: true,
        autoTransformHttpErrors: true,
        includeStacktraceInErrorResponses: true,
        plugins: [
          ApolloServerPluginLandingPageLocalDefault({
            embed: true,
          }),
        ],
        subscriptions: {
          'graphql-ws': true,
        },
        context: (context: any) => {
          if (context?.extra?.request) {
            return {
              req: {
                ...context?.extra?.request,
                headers: {
                  ...context?.extra?.request?.headers,
                  ...context?.connectionParams,
                },
              },
            };
          }

          return { req: context?.req };
        },
      }),
    }),
    PrismaModule,
    NestizenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
