import "styled-components";
declare module "styled-components" {
    interface DefaultTheme {
        colors: {
            background: string;
            surface: string;
            surfaceHover: string;
            border: string;
            primary: string;
            accent: string;
            text: {
                primary: string;
                secondary: string;
                onCard: string;
            };
            status: {
                error: string;
                errorBackground: string;
            };
            focus: string;
        };
        spacing: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            xxl: string;
        };
        typography: {
            fontFamily: string;
            fontSize: {
                sm: string;
                md: string;
                lg: string;
                xl: string;
            };
            fontWeight: {
                regular: number;
                medium: number;
                bold: number;
            };
        };
        borderRadius: {
            sm: string;
            md: string;
            lg: string;
        };
        shadow: {
            card: string;
            cardSelected: string;
        };
    }
}
