const colors = {
	dim: "\x1b[2m",


  red: "\x1b[31m",
  gray: "\x1b[90m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
	blue: "\x1b[34m",
  reset: "\x1b[0m",
} as const;

type Color = keyof typeof colors;



class Logger {
  private parts: string[] = [];

  private add(color: Color, text: string) {
    this.parts.push(`${colors[color]}${text}${colors.reset}`);
    return this;
  }

	time() {
		const timestamp = new Date().toLocaleString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});

		return this.add("dim", timestamp);
	}


	dim(text: string){
		this.add("dim",text);
		return this
	}

  gray(text: string) {
    return this.add("gray", text);
  }

  yellow(text: string) {
    return this.add("yellow", text);
  }

  green(text: string) {
    return this.add("green", text);
  }

  cyan(text: string) {
    return this.add("cyan", text);
  }

  magenta(text: string) {
    return this.add("magenta", text);
  }

	blue(text: string) {
		return this.add("blue", text);
	}


  red(text: string) {
    return this.add("red", text);
  }

  print() {
    console.log(this.parts.join(" "));
  }
}

export function genrateLog() {
  return new Logger();
}

