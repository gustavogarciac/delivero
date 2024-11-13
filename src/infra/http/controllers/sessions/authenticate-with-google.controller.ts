import { BadRequestError } from "@/core/errors/bad-request-error";
import { AuthenticateWithGoogleUseCase } from "@/domain/logistics/application/use-cases/sessions/authenticate-with-google-use-case";
import { Public } from "@/infra/auth/public";
import { BadRequestException, Controller, Get, Redirect, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";

interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

interface GoogleAuthRequest extends Request {
  user: GoogleUser;
}

@Controller()
export class AuthenticateWithGoogleController {
  constructor(private authenticateWithGoogleUseCase: AuthenticateWithGoogleUseCase) {} // Fixed typo here

  @Get('/auth/google')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: GoogleAuthRequest) {
    // This route is handled by the AuthGuard, so no implementation needed here
  }

  @Get("/auth/google/redirect")
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: GoogleAuthRequest, @Res() res: Response) {
    const { email, firstName, lastName, picture } = req.user;

    const result = await this.authenticateWithGoogleUseCase.execute({ email, firstName, lastName, picture });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException("Bad Request");
      }
    }

    const data = result.value;

    if(data.accessToken === null) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/sign-up/google?status=${data.status}&email=${email}&firstName=${firstName}&lastName=${lastName}&picture=${picture}`);
    }

    return { accessToken: data.accessToken, status: data.status, profile: req.user };
  }
}
