package code

import ()

var CodeDeclare = make(map[int]*Code)

type Code struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Ok      bool   `json:"ok"`
}

func init() {

	CodeDeclare[200] = &Code{
		Code:    200,
		Message: "Success",
		Ok:      true,
	}

	CodeDeclare[300] = &Code{
		Code:    300,
		Message: "Friend Offline",
		Ok:      true,
	}

	CodeDeclare[301] = &Code{
		Code:    301,
		Message: "Refresh Friend's Profile",
		Ok:      true,
	}

	CodeDeclare[403] = &Code{
		Code:    403,
		Message: "Protocol Error",
		Ok:      false,
	}

	CodeDeclare[500] = &Code{
		Code:    500,
		Message: "Internal Server Error",
		Ok:      false,
	}

	CodeDeclare[501] = &Code{
		Code:    501,
		Message: "Account Info Empty",
		Ok:      false,
	}

	CodeDeclare[502] = &Code{
		Code:    502,
		Message: "Password Info Empty",
		Ok:      false,
	}

	CodeDeclare[503] = &Code{
		Code:    503,
		Message: "Secure Mail Info Empty",
		Ok:      false,
	}

	CodeDeclare[504] = &Code{
		Code:    504,
		Message: "Account Already Exists",
		Ok:      false,
	}

	CodeDeclare[505] = &Code{
		Code:    505,
		Message: "Account & Password Wrong",
		Ok:      false,
	}

	CodeDeclare[506] = &Code{
		Code:    506,
		Message: "Dialogue ID Empty",
		Ok:      false,
	}

	CodeDeclare[507] = &Code{
		Code:    507,
		Message: "Dialogue Send To Friend Failed",
		Ok:      false,
	}

	CodeDeclare[508] = &Code{
		Code:    508,
		Message: "Friend Is Offline",
		Ok:      false,
	}

	CodeDeclare[509] = &Code{
		Code:    509,
		Message: "Payload Must Be Text",
		Ok:      false,
	}

	CodeDeclare[510] = &Code{
		Code:    510,
		Message: "Friend ID Empty",
		Ok:      false,
	}

	CodeDeclare[511] = &Code{
		Code:    511,
		Message: "Payload Empty",
		Ok:      false,
	}

	CodeDeclare[512] = &Code{
		Code:    512,
		Message: "Not Relation of Friend",
		Ok:      false,
	}

	CodeDeclare[513] = &Code{
		Code:    513,
		Message: "Login In Other Place",
		Ok:      false,
	}

	CodeDeclare[514] = &Code{
		Code:    514,
		Message: "Auth Info Empty",
		Ok:      false,
	}

	CodeDeclare[515] = &Code{
		Code:    515,
		Message: "Auth Illegal",
		Ok:      false,
	}

	CodeDeclare[516] = &Code{
		Code:    516,
		Message: "Name Empty",
		Ok:      false,
	}

	CodeDeclare[517] = &Code{
		Code:    517,
		Message: "Account ID Empty",
		Ok:      false,
	}

	CodeDeclare[518] = &Code{
		Code:    518,
		Message: "Alias Empty",
		Ok:      false,
	}

	CodeDeclare[519] = &Code{
		Code:    519,
		Message: "Friend Info Empty",
		Ok:      false,
	}

	CodeDeclare[520] = &Code{
		Code:    520,
		Message: "Apply For a Friend",
		Ok:      true,
	}

	CodeDeclare[521] = &Code{
		Code:    521,
		Message: "Alias Empty",
		Ok:      false,
	}

	CodeDeclare[522] = &Code{
		Code:    522,
		Message: "Already Be Friend",
		Ok:      false,
	}

	CodeDeclare[523] = &Code{
		Code:    523,
		Message: "Friend Not Exists",
		Ok:      false,
	}
}
