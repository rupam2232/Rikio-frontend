const ParseContents = ({ content }) => {

    const parseContent = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, index) => {
            if (urlRegex.test(part)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline break-words"
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <>
            {parseContent(content)}
        </>
    );
};

export default ParseContents