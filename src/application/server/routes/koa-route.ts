import { Controller } from '@domain/controllers/controller';

import { Logger } from '@ports/logger';

import { getTypeSafeInputsFromKoaFactory } from '@adapters/routes/get-type-safe-inputs-from.koa';
import { KoaContext, KoaDeserializer } from '@adapters/routes/koa-deserializer.adapter';
import { KoaSerializer } from '@adapters/routes/koa-serializer.adapter';
import ResolvedValue = jest.ResolvedValue;

export const koaRouteFactory = <T extends Controller<any, any>>( // eslint-disable-line  @typescript-eslint/no-explicit-any
    logger: Logger,
    // FROM infrastructure
    controller: T,
    // FROM adapters
    deserializer: KoaDeserializer<Parameters<typeof controller>[0]>,
    serializer: KoaSerializer<ResolvedValue<ReturnType<typeof controller>>>,
) => {
    return async (ctx: KoaContext): Promise<void> => {
        const getTypeSafeInputsFromKoa = getTypeSafeInputsFromKoaFactory(logger, ctx);

        const input = await deserializer(getTypeSafeInputsFromKoa);
        const output = await controller(input);

        await serializer(ctx, output);
    };
};
