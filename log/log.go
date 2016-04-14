package log

import (
	"fmt"
	"os"
	"runtime"
	"time"
)

func Info(msg ...interface{}) {

	if _, _, line, ok := runtime.Caller(1); ok {
		var fmtInfo []interface{}
		fmtInfo = append(fmtInfo, time.Now().Format("2006-01-02 15:04:05"), "[INFO]", line)
		for _, v := range msg {
			fmtInfo = append(fmtInfo, v)
		}
		fmt.Fprintln(os.Stdout, fmtInfo...)
	}
}

func Error(msg ...interface{}) {

	if _, _, line, ok := runtime.Caller(1); ok {
		var fmtInfo []interface{}
		fmtInfo = append(fmtInfo, time.Now().Format("2006-01-02 15:04:05"), "[ERROR]", line)
		for _, v := range msg {
			fmtInfo = append(fmtInfo, v)
		}
		fmt.Fprintln(os.Stdout, fmtInfo...)
	}
}

func Warn(msg ...interface{}) {

	if _, _, line, ok := runtime.Caller(1); ok {
		var fmtInfo []interface{}
		fmtInfo = append(fmtInfo, time.Now().Format("2006-01-02 15:04:05"), "[WARN]", line)
		for _, v := range msg {
			fmtInfo = append(fmtInfo, v)
		}
		fmt.Fprintln(os.Stdout, fmtInfo...)
	}
}
