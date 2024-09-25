import { Transform, Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @Min(1)
    @Type(() => Number) // si no se quiere modificar el main para que transforme los dtos
    limit?: number;
    @IsOptional()
    @IsPositive()
    @Transform(({ value }) => parseInt(value, 10)) // si no se quiere modificar el main para que transforme los dtos
    offset?: number;
    /*
    app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );
    */
}